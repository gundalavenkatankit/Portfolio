"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  unit: string;
  city: string;
  state: string;
  postalCode: string;
  plate: string;
  vehicleState: string;
  make: string;
  model: string;
  year: string;
  residenceFile: string;
  registrationFile: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  securityCode: string;
  agreed: boolean;
};

const initialData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  unit: "",
  city: "Fairview",
  state: "FV",
  postalCode: "",
  plate: "",
  vehicleState: "FV",
  make: "",
  model: "",
  year: "",
  residenceFile: "",
  registrationFile: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  securityCode: "",
  agreed: false,
};

const steps = ["Your details", "Vehicle", "Documents", "Review", "Payment"];

export function PermitApplication() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [submitted, setSubmitted] = useState(false);

  function update(field: keyof FormData, value: string | boolean) {
    setData(current => ({ ...current, [field]: value }));
  }

  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (step === steps.length - 1) setSubmitted(true);
    else setStep(current => current + 1);
  }

  function back() {
    setStep(current => Math.max(0, current - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return <section className="confirmationPage"><div className="confirmationMark" aria-hidden="true">✓</div><p className="civicEyebrow">Application received</p><h1>Thank you, {data.firstName}</h1><p>Your resident parking permit application has been submitted for review.</p><div className="confirmationNumber"><span>Request number</span><strong>FV 10248</strong></div><div className="confirmationActions"><Link className="civicButton" href="/civicconnect/requests/FV10248">View request status →</Link><Link href="/civicconnect">Return to CivicConnect</Link></div><div className="nextSteps"><h2>What happens next</h2><ol><li><strong>Document review</strong><span>City staff will review your documents within three business days.</span></li><li><strong>Status update</strong><span>A fictional update will be shown on your request status page.</span></li><li><strong>Permit delivery</strong><span>Approved permits will be linked to the registered vehicle.</span></li></ol></div></section>;
  }

  return <div className="applicationShell"><section className="applicationIntro"><nav aria-label="Breadcrumb"><Link href="/civicconnect">Home</Link><span>/</span><Link href="/civicconnect/services/parking-permits">Parking permits</Link><span>/</span><span>Apply</span></nav><p className="civicEyebrow">Resident parking permit</p><h1>Apply online</h1><p>Complete each section. Your information stays in this browser and is not sent to a real city system.</p></section><div className="applicationLayout"><aside className="stepPanel"><p>Application progress</p><ol>{steps.map((label, index) => <li className={index === step ? "current" : index < step ? "complete" : ""} key={label}><span>{index < step ? "✓" : index + 1}</span><div><strong>{label}</strong><small>{index < step ? "Complete" : index === step ? "Current step" : "Not started"}</small></div></li>)}</ol></aside><form className="permitForm" onSubmit={next}>
    {step === 0 ? <fieldset><legend>Your details</legend><p className="formHint">Tell us who is applying and where you live.</p><div className="fieldGrid"><label>First name<input required value={data.firstName} onChange={event => update("firstName", event.target.value)} /></label><label>Last name<input required value={data.lastName} onChange={event => update("lastName", event.target.value)} /></label><label>Email address<input required type="email" value={data.email} onChange={event => update("email", event.target.value)} /></label><label>Phone number<input required type="tel" value={data.phone} onChange={event => update("phone", event.target.value)} /></label><label className="fullField">Street address<input required value={data.address} onChange={event => update("address", event.target.value)} /></label><label>Apartment or unit <span>Optional</span><input value={data.unit} onChange={event => update("unit", event.target.value)} /></label><label>City<input required value={data.city} onChange={event => update("city", event.target.value)} /></label><label>State<select value={data.state} onChange={event => update("state", event.target.value)}><option>FV</option><option>NY</option><option>TX</option></select></label><label>Postal code<input required inputMode="numeric" value={data.postalCode} onChange={event => update("postalCode", event.target.value)} /></label></div></fieldset> : null}
    {step === 1 ? <fieldset><legend>Vehicle information</legend><p className="formHint">Enter the vehicle that will use this permit.</p><div className="fieldGrid"><label>License plate<input required value={data.plate} onChange={event => update("plate", event.target.value.toUpperCase())} /></label><label>Registration state<select value={data.vehicleState} onChange={event => update("vehicleState", event.target.value)}><option>FV</option><option>NY</option><option>TX</option></select></label><label>Vehicle make<input required placeholder="Example Honda" value={data.make} onChange={event => update("make", event.target.value)} /></label><label>Vehicle model<input required placeholder="Example Civic" value={data.model} onChange={event => update("model", event.target.value)} /></label><label>Vehicle year<input required inputMode="numeric" value={data.year} onChange={event => update("year", event.target.value)} /></label></div><div className="formNotice"><strong>Why we ask</strong><p>The permit is linked to this vehicle and cannot be used with another vehicle.</p></div></fieldset> : null}
    {step === 2 ? <fieldset><legend>Required documents</legend><p className="formHint">Select a file for each document. Files are not uploaded anywhere in this demonstration.</p><div className="uploadList"><label><span><strong>Proof of residence</strong><small>PDF, JPG, or PNG</small></span><input required type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={event => update("residenceFile", event.target.files?.[0]?.name || "")} /><em>{data.residenceFile || "Choose file"}</em></label><label><span><strong>Vehicle registration</strong><small>PDF, JPG, or PNG</small></span><input required type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={event => update("registrationFile", event.target.files?.[0]?.name || "")} /><em>{data.registrationFile || "Choose file"}</em></label></div><div className="formNotice"><strong>Protect your information</strong><p>Do not include payment card details or unrelated personal records in your documents.</p></div></fieldset> : null}
    {step === 3 ? <fieldset><legend>Review your application</legend><p className="formHint">Check your information before continuing to payment.</p><div className="reviewSections"><section><div><h2>Applicant</h2><button type="button" onClick={() => setStep(0)}>Edit</button></div><dl><dt>Name</dt><dd>{data.firstName} {data.lastName}</dd><dt>Email</dt><dd>{data.email}</dd><dt>Phone</dt><dd>{data.phone}</dd><dt>Address</dt><dd>{data.address}{data.unit ? `, ${data.unit}` : ""}, {data.city}, {data.state} {data.postalCode}</dd></dl></section><section><div><h2>Vehicle</h2><button type="button" onClick={() => setStep(1)}>Edit</button></div><dl><dt>License plate</dt><dd>{data.plate}</dd><dt>Vehicle</dt><dd>{data.year} {data.make} {data.model}</dd><dt>Registration</dt><dd>{data.vehicleState}</dd></dl></section><section><div><h2>Documents</h2><button type="button" onClick={() => setStep(2)}>Edit</button></div><dl><dt>Proof of residence</dt><dd>{data.residenceFile}</dd><dt>Vehicle registration</dt><dd>{data.registrationFile}</dd></dl></section></div><label className="checkField"><input required type="checkbox" checked={data.agreed} onChange={event => update("agreed", event.target.checked)} /><span>I confirm that the information in this fictional application is accurate.</span></label></fieldset> : null}
    {step === 4 ? <fieldset><legend>Simulated payment</legend><p className="formHint">This demonstration does not process or store payment information. Use fictional values only.</p><div className="paymentSummary"><span>Resident parking permit</span><strong>$35.00</strong><small>Valid for one year</small></div><div className="fieldGrid"><label className="fullField">Name on card<input required value={data.cardName} onChange={event => update("cardName", event.target.value)} /></label><label className="fullField">Card number<input required inputMode="numeric" placeholder="Use fictional numbers only" value={data.cardNumber} onChange={event => update("cardNumber", event.target.value)} /></label><label>Expiration<input required placeholder="MM / YY" value={data.expiry} onChange={event => update("expiry", event.target.value)} /></label><label>Security code<input required inputMode="numeric" value={data.securityCode} onChange={event => update("securityCode", event.target.value)} /></label></div><div className="formNotice"><strong>Demonstration only</strong><p>No charge will occur and no payment data will leave this page.</p></div></fieldset> : null}
    <div className="formActions">{step > 0 ? <button className="backButton" type="button" onClick={back}>Back</button> : <Link href="/civicconnect/services/parking-permits">Cancel</Link>}<button className="continueButton" type="submit">{step === steps.length - 1 ? "Submit application" : "Continue"} →</button></div>
  </form></div></div>;
}
