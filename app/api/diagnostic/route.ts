import { NextRequest, NextResponse } from 'next/server';

export interface DiagnosticResult {
  id: string;
  status: 'yes' | 'no' | 'maybe';
  confidence: number;
  reason: string;
  jurisdiction: {
    county: string;
    city?: string;
    zipCode: string;
  };
  projectType: string;
  jobDetails?: string;
  images: string[];
  nextSteps?: string[];
  estimatedTimeline?: string;
  estimatedCost?: {
    min: number;
    max: number;
    unit: string;
  };
  createdAt: string;
}

// In-memory storage for MVP (replace with database in production)
const diagnosticStore: Map<string, DiagnosticResult> = new Map();

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const {
      zipCode,
      projectType,
      answers,
      jobDetails,
      images,
    } = body;
    
    // Validate required fields
    if (!zipCode || !projectType) {
      return NextResponse.json(
        { error: 'Zip code and project type are required' },
        { status: 400 }
      );
    }
    
    // Generate diagnostic ID
    const id = crypto.randomUUID();
    
    // Calculate result based on answers
    const result = calculatePermitResult(projectType, answers, zipCode);
    
    // Get jurisdiction info
    const jurisdiction = getJurisdictionFromZip(zipCode);
    
    // Build diagnostic result
    const diagnostic: DiagnosticResult = {
      id,
      status: result.status,
      confidence: result.confidence,
      reason: result.reason,
      jurisdiction,
      projectType,
      jobDetails: jobDetails || '',
      images: images || [],
      nextSteps: result.nextSteps,
      estimatedTimeline: result.estimatedTimeline,
      estimatedCost: result.estimatedCost,
      createdAt: new Date().toISOString(),
    };
    
    // Store in memory (use database in production)
    diagnosticStore.set(id, diagnostic);
    
    return NextResponse.json({
      success: true,
      diagnostic,
    });
    
  } catch (error) {
    console.error('Diagnostic error:', error);
    return NextResponse.json(
      { error: 'Failed to process diagnostic' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Diagnostic ID required' },
        { status: 400 }
      );
    }
    
    const diagnostic = diagnosticStore.get(id);
    
    if (!diagnostic) {
      return NextResponse.json(
        { error: 'Diagnostic not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ diagnostic });
    
  } catch (error) {
    console.error('Get diagnostic error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve diagnostic' },
      { status: 500 }
    );
  }
}

// Helper function to calculate permit result based on project type and answers
function calculatePermitResult(
  projectType: string,
  answers: Record<string, string>,
  zipCode: string
): {
  status: 'yes' | 'no' | 'maybe';
  confidence: number;
  reason: string;
  nextSteps: string[];
  estimatedTimeline?: string;
  estimatedCost?: { min: number; max: number; unit: string };
} {
  // This is simplified logic - in production, query a database of permit rules
  
  const hasStructural = answers.scope === 'structural' || 
                        answers.repair_type === 'replace' ||
                        answers.height === 'attached';
  const isHighValue = answers.value === '5k-25k' || answers.value === 'over25k';
  const isElevated = answers.height === 'elevated' || answers.height === 'attached';
  const isHurricaneZone = answers.wind_zone === 'yes' || isCoastalZip(zipCode);
  
  if (hasStructural || isHighValue || isElevated) {
    const costMultiplier = isHurricaneZone ? 1.3 : 1;
    return {
      status: 'yes',
      confidence: 85,
      reason: `This ${projectType.replace('_', ' ')} project requires a building permit in Florida. ${isHurricaneZone ? 'Additional hurricane zone requirements apply.' : ''}`,
      nextSteps: [
        `Contact ${getJurisdictionFromZip(zipCode).county} Building Department`,
        'Prepare project plans and specifications',
        'Submit permit application online or in-person',
        'Schedule required inspections',
        'Obtain Certificate of Completion',
      ],
      estimatedTimeline: '2-4 weeks for approval',
      estimatedCost: {
        min: Math.round(150 * costMultiplier),
        max: Math.round(500 * costMultiplier),
        unit: 'permit fee',
      },
    };
  }
  
  if (answers.scope === 'minor' || answers.repair_type === 'repair') {
    return {
      status: 'no',
      confidence: 70,
      reason: 'Minor repairs and cosmetic work typically do not require permits in most Florida jurisdictions.',
      nextSteps: [
        'Proceed with your project',
        'Keep receipts and documentation',
        'Take before/after photos for records',
      ],
    };
  }
  
  return {
    status: 'maybe',
    confidence: 50,
    reason: 'Permit requirements vary by municipality. Your project may require a permit depending on local amendments.',
    nextSteps: [
      `Contact ${getJurisdictionFromZip(zipCode).county} Building Department for confirmation`,
      'Provide project details including scope and value',
      'Ask about expedited review if available',
    ],
  };
}

function getJurisdictionFromZip(zipCode: string): { county: string; city?: string; zipCode: string } {
  const zipPrefix = zipCode.slice(0, 3);
  const countyMap: Record<string, { county: string; city?: string }> = {
    '331': { county: 'Miami-Dade County', city: 'Miami' },
    '330': { county: 'Broward County', city: 'Fort Lauderdale' },
    '334': { county: 'Palm Beach County' },
    '328': { county: 'Orange County', city: 'Orlando' },
    '336': { county: 'Hillsborough County', city: 'Tampa' },
    '322': { county: 'Duval County', city: 'Jacksonville' },
    '339': { county: 'Lee County' },
    '341': { county: 'Collier County' },
    '323': { county: 'Leon County', city: 'Tallahassee' },
    '337': { county: 'Pinellas County' },
    '329': { county: 'Brevard County' },
    '349': { county: 'St. Lucie County' },
    '347': { county: 'Osceola County' },
    '327': { county: 'Seminole County' },
  };
  
  const match = countyMap[zipPrefix];
  return {
    county: match?.county || 'Your County',
    city: match?.city,
    zipCode,
  };
}

function isCoastalZip(zipCode: string): boolean {
  // Simplified coastal detection - in production use proper GIS data
  const coastalPrefixes = ['331', '330', '334', '329', '339', '341', '324', '325'];
  return coastalPrefixes.includes(zipCode.slice(0, 3));
}