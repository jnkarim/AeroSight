"use client";

import { useMemo, useState } from "react";

type Detection = {
  class_id: number;
  class_name: string;
  confidence: number;
  bbox: number[];
};

type PredictionResponse = {
  human_count: number;
  car_count: number;
  inference_time_ms: number;
  detections: Detection[];
  annotated_image_base64: string;
};

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0.25);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  const annotatedImageUrl = useMemo(() => {
    if (!result?.annotated_image_base64) return "";
    return `data:image/jpeg;base64,${result.annotated_image_base64}`;
  }, [result]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setError("");
    setResult(null);

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleDetect() {
    if (!selectedFile) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("confidence", String(confidence));

      const response = await fetch(`${apiBaseUrl}/predict/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.detail || "Prediction request failed.");
      }

      const data: PredictionResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF7F5]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4B2354] via-[#B91C2E] to-[#F0442E]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.18),transparent_25%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-10 text-white">
          <nav className="mb-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-lg font-black shadow-md ring-1 ring-white/20">
                AS
              </div>
              <div>
                <p className="text-xl font-black tracking-tight">AeroSight</p>
                <p className="text-xs text-white/75">by ANTS</p>
              </div>
            </div>

            <div className="hidden rounded-full bg-white/10 px-4 py-2 text-sm text-white/85 ring-1 ring-white/20 md:block">
              YOLO11 • FastAPI • Next.js
            </div>
          </nav>

          <div className="grid gap-10 pb-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white/90 ring-1 ring-white/20">
                Drone-Based Detection & Counting System
              </p>

              <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
                Detect humans and cars from aerial imagery.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82">
                AeroSight is an end-to-end computer vision system for drone image
                analysis, built with a YOLO11 detection model, FastAPI inference
                backend, and a modern Next.js interface.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-white px-4 py-2 font-semibold text-[#B91C2E]">
                  Human Detection
                </span>
                <span className="rounded-full bg-white/15 px-4 py-2 font-semibold text-white ring-1 ring-white/20">
                  Car Detection
                </span>
                <span className="rounded-full bg-white/15 px-4 py-2 font-semibold text-white ring-1 ring-white/20">
                  Human Counting
                </span>
                <span className="rounded-full bg-white/15 px-4 py-2 font-semibold text-white ring-1 ring-white/20">
                  Tracking Ready
                </span>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white/12 p-4 shadow-2xl ring-1 ring-white/20 backdrop-blur">
              <div className="rounded-[1.5rem] bg-white p-6 text-[#1F1B2D] shadow-xl">
                <p className="text-sm font-semibold text-[#7A2E62]">System Overview</p>
                <div className="mt-5 space-y-4">
                  <PipelineItem step="01" title="Upload aerial image" />
                  <PipelineItem step="02" title="YOLO11 inference" />
                  <PipelineItem step="03" title="Bounding box visualization" />
                  <PipelineItem step="04" title="Human and car count output" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-[#1F1B2D]">Run Detection</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Upload a drone image and send it to the FastAPI backend for
                human and car detection.
              </p>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#4B2354]">
                Upload Image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full cursor-pointer rounded-2xl border border-red-100 bg-[#FFF7F5] p-3 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-[#4B2354] file:via-[#B91C2E] file:to-[#F0442E] file:px-4 file:py-2 file:font-semibold file:text-white"
              />
            </label>

            {previewUrl && (
              <div className="mt-5 overflow-hidden rounded-2xl border border-red-100 bg-[#FFF7F5]">
                <img
                  src={previewUrl}
                  alt="Uploaded preview"
                  className="max-h-[320px] w-full object-contain"
                />
              </div>
            )}

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#4B2354]">
                  Confidence Threshold
                </span>
                <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-[#B91C2E]">
                  {confidence.toFixed(2)}
                </span>
              </div>

              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full accent-[#B91C2E]"
              />
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handleDetect}
              disabled={isLoading}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#4B2354] via-[#B91C2E] to-[#F0442E] px-6 py-4 font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Running Detection..." : "Run Detection"}
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard
                label="Humans"
                value={result ? result.human_count : "-"}
                helper="Detected people"
              />
              <MetricCard
                label="Cars"
                value={result ? result.car_count : "-"}
                helper="Detected cars"
              />
              <MetricCard
                label="Latency"
                value={result ? `${result.inference_time_ms} ms` : "-"}
                helper="Backend inference"
              />
            </div>

            <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#1F1B2D]">
                    Detection Output
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Annotated image with bounding boxes and confidence scores.
                  </p>
                </div>
              </div>

              {annotatedImageUrl ? (
                <div className="overflow-hidden rounded-2xl border border-red-100 bg-[#FFF7F5]">
                  <img
                    src={annotatedImageUrl}
                    alt="Detection output"
                    className="max-h-[520px] w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-red-200 bg-[#FFF7F5] text-center">
                  <div>
                    <p className="font-bold text-[#7A2E62]">No result yet</p>
                    <p className="mt-2 text-sm text-gray-500">
                      Upload an image and run detection.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-[#1F1B2D]">
                Detection Table
              </h2>

              <div className="mt-4 overflow-hidden rounded-2xl border border-red-100">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-[#FFF7F5] text-[#4B2354]">
                    <tr>
                      <th className="px-4 py-3 font-bold">Class</th>
                      <th className="px-4 py-3 font-bold">Confidence</th>
                      <th className="px-4 py-3 font-bold">Bounding Box</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result?.detections?.length ? (
                      result.detections.map((detection, index) => (
                        <tr
                          key={`${detection.class_name}-${index}`}
                          className="border-t border-red-50"
                        >
                          <td className="px-4 py-3 font-semibold text-[#1F1B2D]">
                            {detection.class_name}
                          </td>
                          <td className="px-4 py-3">
                            {(detection.confidence * 100).toFixed(1)}%
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            [{detection.bbox.join(", ")}]
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          No detections available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10 rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-[#1F1B2D]">Model Notes</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <InfoCard
              title="Dataset"
              text="VisDrone was converted from a 10-class dataset into a 2-class human/car detection task."
            />
            <InfoCard
              title="Human Count"
              text="The system counts all detected objects classified as human in the current image."
            />
            <InfoCard
              title="Known Challenge"
              text="Small humans in high-altitude drone images are difficult to detect due to scale, occlusion, and dense scenes."
            />
          </div>
        </section>
      </section>
    </main>
  );
}

function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-3xl border border-red-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-[#7A2E62]">{label}</p>
      <p className="mt-2 text-3xl font-black text-[#B91C2E]">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{helper}</p>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-[#FFF7F5] p-5">
      <h3 className="font-black text-[#4B2354]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>
    </div>
  );
}

function PipelineItem({ step, title }: { step: string; title: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-[#FFF7F5] p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#4B2354] via-[#B91C2E] to-[#F0442E] text-sm font-black text-white">
        {step}
      </div>
      <p className="font-bold text-[#1F1B2D]">{title}</p>
    </div>
  );
}