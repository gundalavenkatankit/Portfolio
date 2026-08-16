"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type ReportData = {
  category: string;
  address: string;
  locationDetail: string;
  description: string;
  photo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  contactMethod: string;
  updates: boolean;
  confirmed: boolean;
};

const categories = [
  ["Roads", "Pothole or damaged road"],
  ["Lights", "Broken streetlight"],
  ["Trash", "Missed trash collection"],
  ["Graffiti", "Graffiti or property damage"],
  ["Signs", "Damaged street sign"],
  ["Parks", "Park maintenance"],
];

const initialData: ReportData = {
  category: "",
  address: "",
  locationDetail: "",
  description: "",
  photo: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  contactMethod: "Email",
  updates: true,
  confirmed: false,
};

const steps = ["Category", "Location", "Details", "Contact", "Review"];

export function IssueReport() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ReportData>(initialData);
  const [submitted, setSubmitted] = useState(false);

  function update(field: keyof ReportData, value: string | boolean) {
    setData(current => ({ ...current, [field]: value }));
  }

  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === steps.length - 1) setSubmitted(true);
    else setStep(current => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep(current => Math.max(0, current - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return <section className="confirmationPage"><div className="confirmationMark" aria-hidden="true">✓</div><p className="civicEyebrow">Report received</p><h1>Thank you for helping Fairview</h1><p>Your report has been sent to the public works team for review.</p><div className="confirmationNumber"><span>Service request number</span><strong>FV 31184</strong></div><div className="confirmationActions"><Link className="civicButton" href="/civicconnect/requests/FV31184">View request status →</Link><Link href="/civicconnect">Return to CivicConnect</Link></div><div className="nextSteps"><h2>What happens next</h2><ol><li><strong>City review</strong><span>The report will be checked and assigned to the right team.</span></li><li><strong>Work scheduled</strong><span>The team will assess the issue and plan the required work.</span></li><li><strong>Status update</strong><span>You can use the request number to follow progress.</span></li></ol></div></section>;
  }

  return <div className="applicationShell"><section className="applicationIntro"><nav aria-label="Breadcrumb"><Link href="/civicconnect">Home</Link><span>/</span><span>Report an issue</span></nav><p className="civicEyebrow">Fairview 311</p><h1>Report a city issue</h1><p>Tell us about a nonemergency problem in a public place. For immediate danger, call 911.</p></section><div className="applicationLayout"><aside className="stepPanel"><p>Report progress</p><ol>{steps.map((label, index) => <li className={index === step ? "current" : index < step ? "complete" : ""} key={label}><span>{index < step ? "✓" : index + 1}</span><div><strong>{label}</strong><small>{index < step ? "Complete" : index === step ? "Current step" : "Not started"}</small></div></li>)}</ol></aside><form className="permitForm" onSubmit={next}>
    {step === 0 ? <fieldset><legend>What is the issue?</legend><p className="formHint">Choose the category that best matches the problem.</p><div className="choiceGrid">{categories.map(([icon, label]) => <label className={data.category === label ? "selected" : ""} key={label}><input required type="radio" name="category" value={label} checked={data.category === label} onChange={event => update("category", event.target.value)} /><span aria-hidden="true">{icon.slice(0, 1)}</span><strong>{label}</strong></label>)}</div><div className="emergencyNotice"><strong>Is anyone in immediate danger?</strong><p>Call 911 for emergencies. Do not use this form.</p></div></fieldset> : null}
    {step === 1 ? <fieldset><legend>Where is the issue?</legend><p className="formHint">Provide the closest address or a clear description of the location.</p><div className="fieldGrid"><label className="fullField">Street address or intersection<input required placeholder="Example 125 Oak Street" value={data.address} onChange={event => update("address", event.target.value)} /></label><label className="fullField">Location details <span>Optional</span><textarea placeholder="Example beside the north bus stop" value={data.locationDetail} onChange={event => update("locationDetail", event.target.value)} /></label></div><div className="locationPreview" aria-label="Map placeholder"><span>FV</span><strong>Fairview location preview</strong><p>A real city service could show an interactive map here.</p></div></fieldset> : null}
    {step === 2 ? <fieldset><legend>Describe the problem</legend><p className="formHint">Add details that will help the city team understand what needs attention.</p><div className="fieldGrid"><label className="fullField">Issue description<textarea required minLength={20} maxLength={800} placeholder="Describe what you observed and when you noticed it" value={data.description} onChange={event => update("description", event.target.value)} /></label></div><p className="characterCount">{data.description.length} of 800 characters</p><div className="uploadList singleUpload"><label><span><strong>Add a photo</strong><small>Optional. JPG or PNG</small></span><input type="file" accept=".jpg,.jpeg,.png" onChange={event => update("photo", event.target.files?.[0]?.name || "")} /><em>{data.photo || "Choose photo"}</em></label></div></fieldset> : null}
    {step === 3 ? <fieldset><legend>How can we contact you?</legend><p className="formHint">Contact details help the city ask questions and send updates.</p><div className="fieldGrid"><label>First name<input required value={data.firstName} onChange={event => update("firstName", event.target.value)} /></label><label>Last name<input required value={data.lastName} onChange={event => update("lastName", event.target.value)} /></label><label>Email address<input required type="email" value={data.email} onChange={event => update("email", event.target.value)} /></label><label>Phone number <span>Optional</span><input type="tel" value={data.phone} onChange={event => update("phone", event.target.value)} /></label></div><fieldset className="nestedFieldset"><legend>Preferred contact method</legend><div className="inlineChoices"><label><input type="radio" name="contact" value="Email" checked={data.contactMethod === "Email"} onChange={event => update("contactMethod", event.target.value)} /> Email</label><label><input type="radio" name="contact" value="Phone" checked={data.contactMethod === "Phone"} onChange={event => update("contactMethod", event.target.value)} /> Phone</label></div></fieldset><label className="checkField"><input type="checkbox" checked={data.updates} onChange={event => update("updates", event.target.checked)} /><span>Send me status updates about this report.</span></label></fieldset> : null}
    {step === 4 ? <fieldset><legend>Review your report</legend><p className="formHint">Check the details before submitting.</p><div className="reviewSections"><section><div><h2>Issue</h2><button type="button" onClick={() => setStep(0)}>Edit</button></div><dl><dt>Category</dt><dd>{data.category}</dd><dt>Description</dt><dd>{data.description}</dd><dt>Photo</dt><dd>{data.photo || "None selected"}</dd></dl></section><section><div><h2>Location</h2><button type="button" onClick={() => setStep(1)}>Edit</button></div><dl><dt>Address</dt><dd>{data.address}</dd><dt>Details</dt><dd>{data.locationDetail || "No additional details"}</dd></dl></section><section><div><h2>Contact</h2><button type="button" onClick={() => setStep(3)}>Edit</button></div><dl><dt>Name</dt><dd>{data.firstName} {data.lastName}</dd><dt>Email</dt><dd>{data.email}</dd><dt>Method</dt><dd>{data.contactMethod}</dd><dt>Updates</dt><dd>{data.updates ? "Yes" : "No"}</dd></dl></section></div><label className="checkField"><input required type="checkbox" checked={data.confirmed} onChange={event => update("confirmed", event.target.checked)} /><span>I confirm this is a nonemergency issue and the information is accurate.</span></label></fieldset> : null}
    <div className="formActions">{step > 0 ? <button className="backButton" type="button" onClick={back}>Back</button> : <Link href="/civicconnect">Cancel</Link>}<button className="continueButton" type="submit">{step === steps.length - 1 ? "Submit report" : "Continue"} →</button></div>
  </form></div></div>;
}
