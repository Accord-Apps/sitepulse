export interface HeadingItem {
  tag: string;
  text: string;
}

export interface ImageIssue {
  src: string;
  alt: string;
  reason: string;
}

export interface SecurityHeaderCheck {
  name: string;
  present: boolean;
  value?: string;
  description: string;
}

export interface AuditResult {
  url: string;
  domain: string;
  timestamp: string;
  overallScore: number;
  overallGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  
  scores: {
    performance: number;
    seo: number;
    security: number;
  };

  timings: {
    ttfbMs: number;
    totalMs: number;
  };

  executive: {
    headline: string;
    conversionRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
    revenueImpactNote: string;
    topPriorities: {
      title: string;
      description: string;
      severity: 'critical' | 'warning' | 'good';
    }[];
    developerHandoffNote: string;
  };

  seo: {
    title: {
      text: string;
      length: number;
      status: 'good' | 'warning' | 'poor';
      recommendation: string;
    };
    description: {
      text: string;
      length: number;
      status: 'good' | 'warning' | 'poor';
      recommendation: string;
    };
    canonical: {
      url: string | null;
      status: 'good' | 'warning' | 'poor';
    };
    robots: {
      content: string | null;
      isIndexable: boolean;
    };
    headings: {
      h1Count: number;
      h1List: string[];
      h2Count: number;
      h3Count: number;
      status: 'good' | 'warning' | 'poor';
      recommendation: string;
    };
    images: {
      total: number;
      missingAltCount: number;
      issues: ImageIssue[];
      status: 'good' | 'warning' | 'poor';
    };
    openGraph: {
      title: string | null;
      description: string | null;
      image: string | null;
      type: string | null;
      status: 'good' | 'warning' | 'poor';
    };
    mobile: {
      hasViewport: boolean;
      status: 'good' | 'poor';
    };
    language: string | null;
  };

  performance: {
    responseCode: number;
    responseStatusText: string;
    htmlSizeBytes: number;
    isCompressed: boolean;
    compressionType: string | null;
    cacheControl: string | null;
    scriptCount: number;
    stylesheetCount: number;
    metrics: {
      ttfbRating: 'fast' | 'moderate' | 'slow';
      htmlSizeRating: 'lightweight' | 'moderate' | 'heavy';
    };
  };

  security: {
    isHttps: boolean;
    headers: SecurityHeaderCheck[];
    status: 'good' | 'warning' | 'poor';
  };
}
