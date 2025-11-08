"use client";

import { useCallback, useRef, useState } from "react";

interface RecorderState {
  isRecording: boolean;
  statusMessage: string;
}

export function useCanvasRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [state, setState] = useState<RecorderState>({
    isRecording: false,
    statusMessage: "Ready to record."
  });
  const chunksRef = useRef<Blob[]>([]);

  const start = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) {
      setState({ isRecording: false, statusMessage: "Canvas is not ready yet." });
      return;
    }

    if (!("MediaRecorder" in window)) {
      setState({ isRecording: false, statusMessage: "MediaRecorder is not supported in this browser." });
      return;
    }

    try {
      const stream = canvas.captureStream(60);
      const codecs = [
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm"
      ];
      const mimeType = codecs.find(type => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType ?? undefined,
        videoBitsPerSecond: 6_000_000
      });
      chunksRef.current = [];
      recorder.ondataavailable = event => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        setState(prev => ({ ...prev, isRecording: false }));
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setState({ isRecording: true, statusMessage: "Recording…" });
    } catch (error) {
      console.error(error);
      setState({ isRecording: false, statusMessage: "Failed to start recording." });
    }
  }, []);

  const stop = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return null;

    if (recorder.state !== "inactive") {
      recorder.stop();
    }
    mediaRecorderRef.current = null;

    const blob = new Blob(chunksRef.current, { type: "video/webm" });
    chunksRef.current = [];
    setState({ isRecording: false, statusMessage: "Recording saved." });
    return blob;
  }, []);

  return {
    start,
    stop,
    state
  };
}
