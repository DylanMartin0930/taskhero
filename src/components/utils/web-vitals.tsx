"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
	useReportWebVitals((metric) => {
		switch (metric.name) {
			case "CLS":
				// Visual stability metric
				console.log("Visual Stability (CLS):", {
					value: metric.value,
					rating: metric.rating, // "good" | "needs-improvement" | "poor"
					navigationType: metric.navigationType,
				});
				break;

			case "FID":
				// Interactivity metric
				console.log("Interactivity (FID):", {
					value: `${metric.value}ms`,
					rating: metric.rating,
					navigationType: metric.navigationType,
				});
				break;

			case "LCP":
				// Loading performance metric
				console.log("Load Performance (LCP):", {
					value: `${metric.value}ms`,
					rating: metric.rating,
					navigationType: metric.navigationType,
				});
				break;

			case "TTFB":
				// Server response time metric
				console.log("Server Response (TTFB):", {
					value: `${metric.value}ms`,
					rating: metric.rating,
					navigationType: metric.navigationType,
				});
				break;
		}
	});
}
