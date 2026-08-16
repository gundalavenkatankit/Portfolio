"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const requestRoutes: Record<string, string> = {
  FV10248: "/civicconnect/requests/FV10248",
  FV31184: "/civicconnect/requests/FV31184",
};

export function RequestTracker() {
  const router = useRouter();
  const [requestNumber, setRequestNumber] = useState("");
  const [error, setError] = useState("");

  function checkStatus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = requestNumber.toUpperCase().replaceAll(" ", "");
    const route = requestRoutes[normalized];
    if (route) router.push(route);
    else setError("We could not find that request. Try FV 10248 or FV 31184 for this demonstration.");
  }

  return <form onSubmit={checkStatus} noValidate><label htmlFor="tracking">Request number</label><input id="tracking" value={requestNumber} onChange={event => { setRequestNumber(event.target.value); setError(""); }} placeholder="Example FV 10248" required aria-describedby={error ? "trackingError" : undefined} /><button type="submit">Check status</button>{error && <p className="fieldError" id="trackingError" role="alert">{error}</p>}</form>;
}
