import { NextRequest } from "next/server";

const supportedAreas = new Set("AL,AK,AZ,AR,CA,CO,CT,DE,DC,FL,GA,HI,ID,IL,IN,IA,KS,KY,LA,ME,MD,MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ,NM,NY,NC,ND,OH,OK,OR,PA,RI,SC,SD,TN,TX,UT,VT,VA,WA,WV,WI,WY,PR,VI,GU,AS,MP".split(","));

type DeclarationRecord = {
  disasterNumber: number;
  femaDeclarationString: string;
  declarationTitle: string;
  declarationType: string;
  declarationDate: string;
  incidentType: string;
  incidentBeginDate: string | null;
  incidentEndDate: string | null;
  designatedArea: string;
  ihProgramDeclared: boolean;
  iaProgramDeclared: boolean;
  paProgramDeclared: boolean;
  hmProgramDeclared: boolean;
  lastIAFilingDate: string | null;
  lastRefresh: string;
};

export async function GET(request: NextRequest) {
  const area = request.nextUrl.searchParams.get("area")?.toUpperCase() ?? "TX";
  if (!supportedAreas.has(area)) return Response.json({ error: "Unsupported area" }, { status: 400 });

  const parameters = new URLSearchParams({
    "$filter": `state eq '${area}'`,
    "$orderby": "declarationDate desc",
    "$top": "200",
  });

  try {
    const response = await fetch(`https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries?${parameters}`, { next: { revalidate: 1800 } });
    if (!response.ok) throw new Error(`OpenFEMA returned ${response.status}`);
    const data = await response.json() as { DisasterDeclarationsSummaries?: DeclarationRecord[] };
    const grouped = new Map<number, {
      disasterNumber: number;
      declarationCode: string;
      title: string;
      declarationType: string;
      declarationDate: string;
      incidentType: string;
      incidentBeginDate: string | null;
      incidentEndDate: string | null;
      designatedAreas: string[];
      individualAssistance: boolean;
      publicAssistance: boolean;
      hazardMitigation: boolean;
      filingDeadline: string | null;
      lastRefresh: string;
      sourceUrl: string;
    }>();

    for (const record of data.DisasterDeclarationsSummaries ?? []) {
      const existing = grouped.get(record.disasterNumber);
      if (existing) {
        if (!existing.designatedAreas.includes(record.designatedArea)) existing.designatedAreas.push(record.designatedArea);
        existing.individualAssistance ||= record.ihProgramDeclared || record.iaProgramDeclared;
        existing.publicAssistance ||= record.paProgramDeclared;
        existing.hazardMitigation ||= record.hmProgramDeclared;
        continue;
      }
      if (grouped.size >= 8) continue;
      grouped.set(record.disasterNumber, {
        disasterNumber: record.disasterNumber,
        declarationCode: record.femaDeclarationString,
        title: record.declarationTitle,
        declarationType: record.declarationType,
        declarationDate: record.declarationDate,
        incidentType: record.incidentType,
        incidentBeginDate: record.incidentBeginDate,
        incidentEndDate: record.incidentEndDate,
        designatedAreas: [record.designatedArea],
        individualAssistance: record.ihProgramDeclared || record.iaProgramDeclared,
        publicAssistance: record.paProgramDeclared,
        hazardMitigation: record.hmProgramDeclared,
        filingDeadline: record.lastIAFilingDate,
        lastRefresh: record.lastRefresh,
        sourceUrl: `https://www.fema.gov/disaster/${record.disasterNumber}`,
      });
    }

    return Response.json({ declarations: [...grouped.values()], source: "OpenFEMA Disaster Declarations Summaries" });
  } catch {
    return Response.json({ declarations: [], unavailable: true, source: "OpenFEMA Disaster Declarations Summaries" });
  }
}
