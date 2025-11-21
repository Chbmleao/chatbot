import { useState, useEffect, useRef, useCallback } from "react";

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: {
      new (): SpeechRecognition;
    };
    SpeechRecognition?: {
      new (): SpeechRecognition;
    };
  }
}

export interface UseVoiceInputOptions {
  onTranscript?: (finalTranscript: string) => void;
  onInterimTranscript?: (interimTranscript: string) => void;
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export interface UseVoiceInputReturn {
  isRecording: boolean;
  isSupported: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  toggleRecording: () => void;
  interim: string;
}

export function useVoiceInput(options: UseVoiceInputOptions = {}): UseVoiceInputReturn {
  const {
    onTranscript,
    onInterimTranscript,
    lang = "en-US",
    continuous = false,
    interimResults = true,
  } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [interim, setInterim] = useState("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    setIsSupported(true);

    return () => {
      recognition.abort();
    };
  }, []);

  useEffect(() => {
    if (!recognitionRef.current) return;

    const recognition = recognitionRef.current;
    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onresult = (event) => {
      const result = event.results[event.resultIndex];
      const transcript = result[0].transcript;

      // Final result
      if (result.isFinal) {
        setInterim("");
        onTranscript?.(transcript);
      } else {
        // Interim result (streaming)
        setInterim(transcript);
        onInterimTranscript?.(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        alert("Microphone permission denied.");
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      // Chrome fires onend after every phrase, even continuous mode
      if (continuous && isRecording) {
        recognition.start(); // auto-restart
      } else {
        setIsRecording(false);
      }
    };
  }, [lang, continuous, interimResults, onTranscript, onInterimTranscript, isRecording]);

  const startRecording = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || isRecording) return;

    try {
      recognition.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsRecording(false);
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || !isRecording) return;

    recognition.stop(); // triggers onend
    setIsRecording(false);
    setInterim("");
  }, [isRecording]);

  const toggleRecording = useCallback(() => {
    isRecording ? stopRecording() : startRecording();
  }, [isRecording, startRecording, stopRecording]);

  return {
    isRecording,
    isSupported,
    startRecording,
    stopRecording,
    toggleRecording,
    interim,
  };
}
