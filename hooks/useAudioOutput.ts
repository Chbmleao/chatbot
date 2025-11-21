import { useState, useEffect, useRef, useCallback } from "react";

export interface UseAudioOutputOptions {
  onEnd?: () => void;
  onError?: (error: SpeechSynthesisErrorEvent) => void;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

export interface UseAudioOutputReturn<T = string> {
  isPlaying: boolean;
  currentId: T | null;
  isSupported: boolean;
  play: (id: T, text: string) => void;
  stop: () => void;
  toggle: (id: T, text: string) => void;
}

/**
 * Custom hook for text-to-speech audio output using Web Speech API
 * @param options Configuration options for speech synthesis
 * @returns Object with playing state and control functions
 */
export function useAudioOutput<T = string>(
  options: UseAudioOutputOptions = {}
): UseAudioOutputReturn<T> {
  const {
    onEnd,
    onError,
    rate = 1,
    pitch = 1,
    volume = 1,
    lang = "en-US",
  } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentId, setCurrentId] = useState<T | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check browser support
  useEffect(() => {
    setIsSupported("speechSynthesis" in window);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentId(null);
      utteranceRef.current = null;
    }
  }, [isPlaying]);

  const play = useCallback(
    (id: T, text: string) => {
      // Stop any currently playing audio
      if (isPlaying) {
        window.speechSynthesis.cancel();
        // If clicking the same item, just stop it
        if (currentId === id) {
          setIsPlaying(false);
          setCurrentId(null);
          utteranceRef.current = null;
          return;
        }
      }

      // Check browser support
      if (!isSupported) {
        alert("Your browser does not support text-to-speech.");
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      utterance.lang = lang;

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentId(null);
        utteranceRef.current = null;
        onEnd?.();
      };

      utterance.onerror = (error) => {
        console.error("Speech synthesis error:", error);
        setIsPlaying(false);
        setCurrentId(null);
        utteranceRef.current = null;
        onError?.(error);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setCurrentId(id);
    },
    [isPlaying, currentId, isSupported, rate, pitch, volume, lang, onEnd, onError]
  );

  const toggle = useCallback(
    (id: T, text: string) => {
      if (isPlaying && currentId === id) {
        stop();
      } else {
        play(id, text);
      }
    },
    [isPlaying, currentId, play, stop]
  );

  return {
    isPlaying,
    currentId,
    isSupported,
    play,
    stop,
    toggle,
  };
}

