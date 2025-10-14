import axios from "axios";

export async function getRoboflowResults(imageURL: string): Promise<string[]> {
  if (!imageURL) throw new Error("No image URL provided");

  const models = [
    { id: "trash-detection-1fjjc-zbcef", apiKey: "RcVRegIMRWGbSBG5P2Y9" },
    { id: "firstsetwaste-xkrmc", apiKey: "RcVRegIMRWGbSBG5P2Y9" },
    { id: "waste-detection-cbffo-foffi", apiKey: "JJXP81cU10vS9PXmL2iG" },
    { id: "organic-waste-xnpyb", apiKey: "JJXP81cU10vS9PXmL2iG" },
  ] as const;

  // Send requests in parallel
  const requests = models.map((m) =>
    axios
      .post(`https://serverless.roboflow.com/${m.id}/1`, null, {
        params: {
          api_key: m.apiKey,
          image: imageURL,
        },
      })
      .then((r) => ({ id: m.id, ok: true as const, data: r.data }))
      .catch((e) => ({
        id: m.id,
        ok: false as const,
        error: e?.response?.data || e?.message || String(e),
      }))
  );

  const results = await Promise.all(requests);

  // Extract unique prediction classes
  const predictionClasses = new Set<string>();
  for (const res of results) {
    if (res.ok && Array.isArray(res.data?.predictions)) {
      for (const p of res.data.predictions) {
        if (p.class) predictionClasses.add(p.class);
      }
    }
  }

  return Array.from(predictionClasses);
}
