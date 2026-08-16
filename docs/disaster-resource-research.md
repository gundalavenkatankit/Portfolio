# Disaster Resource Coordinator research

Verified on August 14, 2026. This research is scoped to a United States portfolio product and uses primary government or provider sources.

## Product direction

Build a location based coordinator that answers four urgent questions:

1. What official hazards affect this location now?
2. Where is the nearest suitable open shelter?
3. Has FEMA declared this area eligible for recovery programs?
4. Which official local contacts and guidance should the resident use next?

The interface should clearly distinguish live alerts, current shelter information, federal declarations, and preparedness guidance. A FEMA declaration is not a live warning, and preparedness guidance is not an instruction to ignore local authorities.

## Recommended data sources

### National Weather Service alerts and forecasts

The National Weather Service API at [api.weather.gov](https://api.weather.gov) provides forecasts, observations, and active watches, warnings, and advisories. Alert responses use GeoJSON by default and follow Common Alerting Protocol concepts. Active alerts can be requested by point, state, county or forecast zone. A location based MVP can call `GET /alerts/active?point={latitude},{longitude}`. [NWS API documentation](https://www.weather.gov/documentation/services-web-api) [NWS alerts documentation](https://www.weather.gov/documentation/services-web-alerts)

Availability and usage:

* No API key or fee is currently required.
* Requests should send a descriptive `User Agent` containing a site or contact email.
* The general API has reasonable rate limits that NWS does not publish. The alerts service recommends polling no more often than every 30 seconds.
* Responses should be cached, failures should retain a visible last updated time, and alert instructions should be displayed as issued rather than rewritten as personalized safety advice.
* NWS states that alert history from `/alerts` covers the past seven days. Use `/alerts/active` for current conditions.

Useful fields include alert identifier, event, headline, severity, urgency, certainty, effective time, onset, expiration, area description, geometry, description, instruction, response type, sender name, and source URL.

### FEMA disaster declarations

OpenFEMA publishes official federal disaster declaration records from 1953 onward. The current Version 2 endpoint is `https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries`. It supports OData style selection, filtering, ordering, skipping, and limiting. A live endpoint check succeeded during this research. [OpenFEMA overview](https://www.fema.gov/about/openfema) [Disaster Declarations Summaries documentation](https://www.fema.gov/about/openfema/data-sets)

Availability and usage:

* OpenFEMA requires no registration and exposes read only public data.
* The declaration dataset is refreshed frequently, but `lastRefresh` must be shown because individual records may lag or be corrected.
* FEMA warns that the source includes historical manual entry and a small amount of human error.
* Declarations describe federal status and program availability. They must not be used as a proxy for immediate danger.

Useful fields include disaster number, declaration string, state, designated area, declaration type, declaration date, incident type, incident title, incident dates, individual assistance status, public assistance status, hazard mitigation status, last filing date, and last refresh.

### FEMA shelter data

FEMA publishes an ESF 6 Shelter System ArcGIS service, formerly called the National Shelter System. Its public layers include open, closed, full, and alert shelters plus attributes for wheelchair accessibility, ADA compliance, generator availability, capacity, population, evacuation type, pet accommodation, and flood or surge exposure. The service supports JSON and GeoJSON queries and currently advertises a maximum record count of 4,000. [FEMA shelter FeatureServer](https://gis.fema.gov/arcgis/rest/services/NSS/FEMA_NSS/FeatureServer) [FEMA shelter layer details](https://gis.fema.gov/arcgis/rest/services/NSS/FEMA_NSS/MapServer/layers)

Availability and usage:

* The ArcGIS query interface is publicly reachable and does not advertise an API key requirement.
* Treat it as an operational external dependency, not a guaranteed consumer API contract. Cache only briefly, retain the source timestamp, and provide the official FEMA and Red Cross fallback paths.
* Do not assume every accessibility field is present or current. Label unknown values as unknown rather than no.
* Shelter status and capacity can change quickly. Tell users to verify availability before traveling.

FEMA also directs the public to its app, the Red Cross shelter map, or the SMS flow `SHELTER` plus a ZIP code to `43362`. FEMA notes that the SMS option has geographic and carrier limitations. [FEMA mobile products and shelter guidance](https://www.fema.gov/about/news-multimedia/mobile-products)

### FEMA Disaster Recovery Centers

FEMA exposes an ArcGIS service for active Disaster Recovery Centers and their onsite services. FEMA says this source is updated hourly. Recovery centers help with applications, case questions, housing resources, referrals, and other recovery support. They are not emergency shelters. [FEMA DRC service](https://gis.fema.gov/arcgis/rest/services/FEMA/DRC_Services_Relate/MapServer) [Official DRC locator](https://egateway.fema.gov/ESF6/DRCLocator)

Use recovery centers only in a distinct recovery section. Useful fields include location, hours, accessibility information, offered services, disaster association, and update time.

### Ready.gov preparedness guidance

[Ready.gov](https://www.ready.gov) is FEMA's official public preparedness site. It provides hazard specific guidance, emergency kit planning, family communication planning, evacuation preparation, and recovery information. Guidance is content, not a live data feed.

For the MVP, curate links and short source attributed summaries for the selected scenario. Preserve a direct link to the official page and show a content reviewed date. During an incident, prioritize instructions from state and local authorities over generic preparedness content.

### State and local emergency information

Evacuation orders, road closures, warming or cooling centers, local food distribution, boil water notices, transit changes, and local shelter details often come from state, tribal, territorial, county, and city authorities. There is no single verified national open API that normalizes all of them.

The MVP should use a curated registry for one demonstration region. Each entry should name the owning agency, official website, emergency phone, 211 availability, alert signup page, supported geography, content type, update method, and last verification date. Never scrape social posts and present them as authoritative instructions without clear source and timestamp information.

## Sources that should not power the first MVP

### FEMA IPAWS All Hazards Information Feed

The feed is real time and carries public alerts in Common Alerting Protocol format, but access is controlled. FEMA requires an approved account and Memorandum of Agreement, and the interface is PIN controlled. It is not an anonymous open API suitable for an initial portfolio deployment. The delayed IPAWS archive is useful for analysis and testing, but FEMA delays it by 24 hours specifically to prevent confusion with active alerts. [FEMA developer access requirements](https://www.fema.gov/emergency-managers/practitioners/integrated-public-alert-warning-system/technology-developers) [FEMA IPAWS archive service](https://gis.fema.gov/arcgis/rest/services/FEMA/IPAWS_Archive/FeatureServer)

Recommendation: use NWS for live weather hazards and clearly link users to official state and local alert systems. Consider IPAWS only if the project later obtains approved access.

### Unverified Red Cross API endpoints

The American Red Cross shelter map is an official public locator, and FEMA recommends it. No stable, openly documented Red Cross shelter API with clear public usage terms was verified in this research. Do not reverse engineer private endpoints. Use FEMA's shelter service for structured demonstration data and link to the official Red Cross locator as a verification path.

## Accessibility and emergency communication requirements

FEMA guidance says emergency information for people with disabilities must be comparable in content and detail, accessible, understandable, and timely. FEMA also emphasizes equal opportunity, integrated services, physical access, effective communication, service animals, accessible transportation, and participation by people with access and functional needs in planning. [FEMA emergency planning guidance](https://www.fema.gov/sites/default/files/documents/fema_npd_developing-and-maintaining-emergency_052125.pdf) [FEMA functional needs support guidance](https://www.fema.gov/pdf/about/odic/fnss_guidance.pdf)

Product requirements:

* Make critical information available without relying on maps, color, animation, sound, or icons alone.
* Use semantic headings, landmarks, lists, status messages, keyboard access, visible focus, large touch targets, strong contrast, and screen reader tested labels.
* Show severity and status as text. Do not use alarming motion or auto advancing content.
* Keep official alert text intact, with expandable detail for long descriptions.
* Support language selection and preserve the issuing authority's translated content when available. Do not claim automated translations are official.
* Let users filter shelters for wheelchair access, service animals, pets, generator availability, and medical or functional needs, while preserving an unknown state.
* Provide phone, SMS, and direct official site alternatives for people who cannot use the map or web flow.
* Minimize location retention. A point lookup should not require an account or save a precise location by default.
* State plainly that the product does not replace 911 or instructions from authorities.

## Recommended MVP scenario

Use a fictional hurricane and flood response in one coastal United States city. This scenario supports live style weather alerts, evacuation guidance, shelter needs, outages, road information, accessible resources, and recovery services without claiming that fictional operational data is real.

The portfolio experience should have:

1. A location entry flow with a fictional demo location and an optional browser location request
2. A current situation summary with official source, issued time, expiration time, and last checked time
3. Active alert cards from NWS or clearly labeled fixtures when the live API has no relevant alert
4. A shelter list and map with distance, status, capacity, accessibility, pet policy, contact details, verification warning, and directions link
5. An essential resources section for food, water, medical help, charging, transportation, family reunification, and 211
6. A local official updates panel powered by the curated regional registry
7. A recovery section showing relevant FEMA declarations and Disaster Recovery Centers
8. A low bandwidth list view and print friendly emergency summary

## Recommended MVP data model

### Location

`id`, `label`, `latitude`, `longitude`, `stateCode`, `countyFips`, `postalCode`, `timezone`, `isDemo`

### Alert

`id`, `source`, `sourceUrl`, `issuer`, `event`, `headline`, `severity`, `urgency`, `certainty`, `status`, `effectiveAt`, `onsetAt`, `expiresAt`, `areas`, `geometry`, `description`, `instruction`, `responseTypes`, `observedAt`

### Shelter

`id`, `source`, `sourceUrl`, `name`, `status`, `address`, `latitude`, `longitude`, `phone`, `openedAt`, `updatedAt`, `capacity`, `occupancy`, `wheelchairAccess`, `adaCompliant`, `serviceAnimals`, `pets`, `generator`, `populationTypes`, `notes`

Accessibility and amenity values should use `yes`, `no`, and `unknown`, not booleans.

### Resource

`id`, `type`, `name`, `provider`, `description`, `status`, `address`, `latitude`, `longitude`, `phone`, `website`, `hours`, `eligibility`, `accessibility`, `languages`, `updatedAt`, `sourceUrl`, `isDemo`

### Declaration

`disasterNumber`, `declarationString`, `title`, `incidentType`, `stateCode`, `designatedArea`, `declarationType`, `declaredAt`, `incidentBeginAt`, `incidentEndAt`, `individualAssistance`, `publicAssistance`, `hazardMitigation`, `filingDeadline`, `lastRefresh`, `sourceUrl`

### OfficialContact

`id`, `jurisdiction`, `agency`, `geography`, `emergencyPhone`, `nonEmergencyPhone`, `website`, `alertSignupUrl`, `resourceTypes`, `languages`, `lastVerifiedAt`

### DataProvenance

Every rendered record should include `sourceName`, `sourceUrl`, `retrievedAt`, `sourceUpdatedAt`, `freshnessLabel`, and `isDemo`. The UI should never visually merge fictional fixtures with live official records without explicit labels.

## Implementation recommendation

Begin with server side adapters for NWS active alerts, OpenFEMA declarations, FEMA shelter GeoJSON, and FEMA recovery centers. Normalize them into the model above, cache by source freshness, and fall back to explicitly labeled demo fixtures when an upstream service is unavailable. The first release should remain informational and should not accept aid requests, volunteer dispatches, or user submitted emergency reports.
