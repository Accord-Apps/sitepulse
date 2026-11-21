import * as cheerio from 'cheerio';
import { AuditResult, ImageIssue, SecurityHeaderCheck } from '@/types/audit';

export async function runAudit(rawUrl: string): Promise<AuditResult> {
  let targetUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl;
  }

  const parsedUrl = new URL(targetUrl);
  const domain = parsedUrl.hostname;

  // Measure network timing
  const startTime = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  let response: Response;
  let ttfbMs = 0;
  let totalMs = 0;
  let html = '';

  try {
    response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 (Compatible; SpeedSeoAuditor/1.0)',
        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
      redirect: 'follow',
    });
    ttfbMs = Math.round(performance.now() - startTime);

    html = await response.text();
    totalMs = Math.round(performance.now() - startTime);
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errorMessage = err instanceof Error ? err.message : 'Unknown fetch error';
    throw new Error(`Unable to reach website "${targetUrl}": ${errorMessage}`);
  } finally {
    clearTimeout(timeoutId);
  }

  const htmlSizeBytes = new TextEncoder().encode(html).length;
  const isHttps = parsedUrl.protocol === 'https:';

  // Parse HTML with Cheerio
  const $ = cheerio.load(html);

  // SEO: Title
  const titleText = $('title').first().text().trim() || '';
  const titleLength = titleText.length;
  let titleStatus: 'good' | 'warning' | 'poor' = 'good';
  let titleRec = 'Title tag is well optimized.';
  if (titleLength === 0) {
    titleStatus = 'poor';
    titleRec = 'Missing <title> tag. Add a unique, descriptive title between 40-60 characters.';
  } else if (titleLength < 30) {
    titleStatus = 'warning';
    titleRec = `Title is too short (${titleLength} chars). Aim for 40-60 characters to maximize search click-throughs.`;
  } else if (titleLength > 65) {
    titleStatus = 'warning';
    titleRec = `Title is too long (${titleLength} chars). Google truncates titles over ~60 characters on search results.`;
  }

  // SEO: Description
  const descText =
    $('meta[name="description" i]').attr('content')?.trim() ||
    $('meta[property="og:description" i]').attr('content')?.trim() ||
    '';
  const descLength = descText.length;
  let descStatus: 'good' | 'warning' | 'poor' = 'good';
  let descRec = 'Meta description length is in the sweet spot (120-160 chars).';
  if (descLength === 0) {
    descStatus = 'poor';
    descRec = 'Missing meta description. Google will generate a random snippet from page text instead.';
  } else if (descLength < 70) {
    descStatus = 'warning';
    descRec = `Meta description is short (${descLength} chars). Expand to 120-155 characters with key benefits and CTA.`;
  } else if (descLength > 165) {
    descStatus = 'warning';
    descRec = `Meta description is long (${descLength} chars) and may be cut off in search snippets.`;
  }

  // SEO: Canonical
  const canonicalHref = $('link[rel="canonical" i]').attr('href')?.trim() || null;
  const canonicalStatus: 'good' | 'warning' | 'poor' = canonicalHref ? 'good' : 'warning';

  // SEO: Robots
  const robotsContent = $('meta[name="robots" i]').attr('content') || null;
  const isIndexable = !robotsContent || !/noindex/i.test(robotsContent);

  // SEO: Headings
  const h1Elements = $('h1');
  const h1Count = h1Elements.length;
  const h1List: string[] = [];
  h1Elements.each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    if (text) h1List.push(text);
  });
  const h2Count = $('h2').length;
  const h3Count = $('h3').length;

  let headingStatus: 'good' | 'warning' | 'poor' = 'good';
  let headingRec = 'Clean heading hierarchy with exactly one primary H1.';
  if (h1Count === 0) {
    headingStatus = 'poor';
    headingRec = 'No <h1> heading found. Every page should have one main H1 stating the core offering.';
  } else if (h1Count > 1) {
    headingStatus = 'warning';
    headingRec = `Found ${h1Count} <h1> headings. Best practice is exactly one H1 per page, with subtopics as H2/H3.`;
  }

  // SEO: Images
  const images = $('img');
  const totalImages = images.length;
  let missingAltCount = 0;
  const imageIssues: ImageIssue[] = [];

  images.each((_, el) => {
    const alt = $(el).attr('alt');
    const src = $(el).attr('src') || $(el).attr('data-src') || '';
    if (alt === undefined || alt === null || alt.trim() === '') {
      missingAltCount++;
      if (imageIssues.length < 8 && src) {
        imageIssues.push({
          src: src.startsWith('//') ? 'https:' + src : src,
          alt: '',
          reason: 'Missing alt attribute for screen readers & Google image search',
        });
      }
    }
  });

  const imageStatus: 'good' | 'warning' | 'poor' =
    totalImages === 0 ? 'good' : missingAltCount === 0 ? 'good' : missingAltCount > 3 ? 'poor' : 'warning';

  // SEO: Open Graph
  const ogTitle = $('meta[property="og:title" i]').attr('content') || null;
  const ogDesc = $('meta[property="og:description" i]').attr('content') || null;
  const ogImage = $('meta[property="og:image" i]').attr('content') || null;
  const ogType = $('meta[property="og:type" i]').attr('content') || null;
  const ogStatus: 'good' | 'warning' | 'poor' =
    ogTitle && ogImage ? 'good' : ogTitle || ogImage ? 'warning' : 'poor';

  // SEO: Mobile & Language
  const hasViewport = $('meta[name="viewport" i]').length > 0;
  const language = $('html').attr('lang') || null;

  // Performance metrics
  const contentEncoding = response.headers.get('content-encoding') || null;
  const isCompressed = Boolean(contentEncoding && /(gzip|br|zstd|deflate)/i.test(contentEncoding));
  const cacheControl = response.headers.get('cache-control') || null;
  const scriptCount = $('script').length;
  const stylesheetCount = $('link[rel="stylesheet"]').length;

  const ttfbRating: 'fast' | 'moderate' | 'slow' =
    ttfbMs < 400 ? 'fast' : ttfbMs < 1000 ? 'moderate' : 'slow';
  const htmlSizeRating: 'lightweight' | 'moderate' | 'heavy' =
    htmlSizeBytes < 60000 ? 'lightweight' : htmlSizeBytes < 200000 ? 'moderate' : 'heavy';

  // Security Headers Check
  const securityHeaders: SecurityHeaderCheck[] = [
    {
      name: 'Strict-Transport-Security (HSTS)',
      present: response.headers.has('strict-transport-security'),
      value: response.headers.get('strict-transport-security') || undefined,
      description: 'Enforces encrypted HTTPS connections and protects against downgrade attacks.',
    },
    {
      name: 'X-Content-Type-Options',
      present: response.headers.has('x-content-type-options'),
      value: response.headers.get('x-content-type-options') || undefined,
      description: 'Prevents MIME-type sniffing vulnerabilities in browsers.',
    },
    {
      name: 'X-Frame-Options',
      present: response.headers.has('x-frame-options'),
      value: response.headers.get('x-frame-options') || undefined,
      description: 'Stops clickjacking by preventing others from embedding your site in iframes.',
    },
    {
      name: 'Content-Security-Policy (CSP)',
      present: response.headers.has('content-security-policy'),
      value: response.headers.get('content-security-policy') || undefined,
      description: 'Restricts script injection, cross-site scripting (XSS), and malicious assets.',
    },
    {
      name: 'Referrer-Policy',
      present: response.headers.has('referrer-policy'),
      value: response.headers.get('referrer-policy') || undefined,
      description: 'Controls how much referrer information is leaked when navigating away.',
    },
  ];

  const presentSecurityCount = securityHeaders.filter((h) => h.present).length;
  const securityStatus: 'good' | 'warning' | 'poor' =
    presentSecurityCount >= 4 ? 'good' : presentSecurityCount >= 2 ? 'warning' : 'poor';

  // Calculate Scores (0 - 100)
  // 1. SEO Score
  let seoScore = 100;
  if (titleStatus === 'poor') seoScore -= 25;
  else if (titleStatus === 'warning') seoScore -= 10;

  if (descStatus === 'poor') seoScore -= 20;
  else if (descStatus === 'warning') seoScore -= 8;

  if (!canonicalHref) seoScore -= 10;
  if (!isIndexable) seoScore -= 30;

  if (headingStatus === 'poor') seoScore -= 15;
  else if (headingStatus === 'warning') seoScore -= 8;

  if (imageStatus === 'poor') seoScore -= 15;
  else if (imageStatus === 'warning') seoScore -= 8;

  if (ogStatus === 'poor') seoScore -= 10;
  else if (ogStatus === 'warning') seoScore -= 5;

  if (!hasViewport) seoScore -= 20;
  if (!language) seoScore -= 5;
  seoScore = Math.max(10, Math.min(100, seoScore));

  // 2. Performance Score
  let perfScore = 100;
  if (ttfbMs > 1500) perfScore -= 35;
  else if (ttfbMs > 800) perfScore -= 20;
  else if (ttfbMs > 400) perfScore -= 10;

  if (htmlSizeBytes > 350000) perfScore -= 25;
  else if (htmlSizeBytes > 150000) perfScore -= 15;

  if (!isCompressed) perfScore -= 15;
  if (!cacheControl) perfScore -= 10;

  if (scriptCount > 30) perfScore -= 15;
  else if (scriptCount > 15) perfScore -= 8;
  perfScore = Math.max(15, Math.min(100, perfScore));

  // 3. Security Score
  let secScore = 100;
  if (!isHttps) secScore -= 50;
  if (!response.headers.has('strict-transport-security')) secScore -= 15;
  if (!response.headers.has('x-content-type-options')) secScore -= 10;
  if (!response.headers.has('x-frame-options')) secScore -= 10;
  if (!response.headers.has('content-security-policy')) secScore -= 10;
  if (!response.headers.has('referrer-policy')) secScore -= 5;
  secScore = Math.max(10, Math.min(100, secScore));

  // Overall Score & Grade
  const overallScore = Math.round(perfScore * 0.4 + seoScore * 0.4 + secScore * 0.2);
  let overallGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (overallScore >= 95) overallGrade = 'A+';
  else if (overallScore >= 90) overallGrade = 'A';
  else if (overallScore >= 80) overallGrade = 'B';
  else if (overallScore >= 70) overallGrade = 'C';
  else if (overallScore >= 60) overallGrade = 'D';

  // Generate Executive Plain-English Summary
  const topPriorities: AuditResult['executive']['topPriorities'] = [];

  if (ttfbMs > 800) {
    topPriorities.push({
      title: 'Slow Server Response (High Bounce Risk)',
      description: `Your server took ${(ttfbMs / 1000).toFixed(2)}s just to start sending the page. Mobile shoppers often abandon pages taking longer than 3 seconds.`,
      severity: 'critical',
    });
  }

  if (titleStatus === 'poor' || titleStatus === 'warning') {
    topPriorities.push({
      title: 'Suboptimal Search Title',
      description: titleRec,
      severity: titleStatus === 'poor' ? 'critical' : 'warning',
    });
  }

  if (missingAltCount > 0) {
    topPriorities.push({
      title: `${missingAltCount} Images Missing Descriptions`,
      description: `Search engines can't 'see' these images. Adding descriptive alt tags helps you rank in Google Image search and satisfies accessibility requirements.`,
      severity: missingAltCount > 5 ? 'critical' : 'warning',
    });
  }

  if (headingStatus === 'poor') {
    topPriorities.push({
      title: 'Missing Main Headline (H1)',
      description: 'Your page lacks an <h1> tag. Google looks at the H1 first to understand what product or service you offer.',
      severity: 'critical',
    });
  }

  if (presentSecurityCount < 3) {
    topPriorities.push({
      title: 'Missing Basic Security Headers',
      description: 'Your site is missing browser defense headers (like HSTS and Clickjacking protection) that build trust with corporate visitors and browsers.',
      severity: 'warning',
    });
  }

  if (topPriorities.length === 0) {
    topPriorities.push({
      title: 'Great Foundation!',
      description: 'Your key on-page SEO tags, server response, and security standards are in good standing.',
      severity: 'good',
    });
  }

  let conversionRisk: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  if (ttfbMs > 1500 || overallScore < 60) conversionRisk = 'Severe';
  else if (ttfbMs > 800 || overallScore < 75) conversionRisk = 'High';
  else if (overallScore < 85) conversionRisk = 'Moderate';

  const revenueImpactNote =
    conversionRisk === 'Severe' || conversionRisk === 'High'
      ? `Based on your speed metrics (${(ttfbMs / 1000).toFixed(2)}s initial response), your site is experiencing unnecessary customer bounce rates. E-commerce research shows every 1-second delay can lower conversions by up to 7%.`
      : 'Your initial page response is healthy. Focus on maintaining fast media assets and targeted keyword metadata to continue growing traffic.';

  const developerHandoffNote = `
### Speed & SEO Audit Report for ${domain}
**Overall Score:** ${overallScore}/100 (Grade: ${overallGrade})
**Generated at:** ${new Date().toUTCString()}

#### 1. Performance & Server
- Response Time (TTFB): ${ttfbMs}ms
- HTML Size: ${(htmlSizeBytes / 1024).toFixed(1)} KB
- Compression: ${isCompressed ? `Enabled (${contentEncoding})` : 'MISSING (Enable Gzip or Brotli)'}
- Scripts: ${scriptCount} tags | Stylesheets: ${stylesheetCount} tags

#### 2. On-Page SEO
- Title (${titleLength} chars): "${titleText || 'MISSING'}"
- Meta Description (${descLength} chars): "${descText || 'MISSING'}"
- Canonical URL: ${canonicalHref || 'MISSING'}
- H1 Headings (${h1Count}): ${h1List.length > 0 ? h1List.map((h) => `"${h}"`).join(', ') : 'None'}
- Images: ${totalImages} total, ${missingAltCount} missing alt attributes.

#### 3. Security Headers
${securityHeaders.map((h) => `- [${h.present ? 'x' : ' '}] ${h.name}`).join('\n')}
`.trim();

  return {
    url: targetUrl,
    domain,
    timestamp: new Date().toISOString(),
    overallScore,
    overallGrade,
    scores: {
      performance: perfScore,
      seo: seoScore,
      security: secScore,
    },
    timings: {
      ttfbMs,
      totalMs,
    },
    executive: {
      headline:
        overallScore >= 90
          ? 'Excellent site performance & technical SEO foundation'
          : overallScore >= 75
          ? 'Good foundation with critical speed & SEO opportunities'
          : 'High risk of lost organic search visibility and mobile conversions',
      conversionRisk,
      revenueImpactNote,
      topPriorities,
      developerHandoffNote,
    },
    seo: {
      title: {
        text: titleText,
        length: titleLength,
        status: titleStatus,
        recommendation: titleRec,
      },
      description: {
        text: descText,
        length: descLength,
        status: descStatus,
        recommendation: descRec,
      },
      canonical: {
        url: canonicalHref,
        status: canonicalStatus,
      },
      robots: {
        content: robotsContent,
        isIndexable,
      },
      headings: {
        h1Count,
        h1List,
        h2Count,
        h3Count,
        status: headingStatus,
        recommendation: headingRec,
      },
      images: {
        total: totalImages,
        missingAltCount,
        issues: imageIssues,
        status: imageStatus,
      },
      openGraph: {
        title: ogTitle,
        description: ogDesc,
        image: ogImage,
        type: ogType,
        status: ogStatus,
      },
      mobile: {
        hasViewport,
        status: hasViewport ? 'good' : 'poor',
      },
      language,
    },
    performance: {
      responseCode: response.status,
      responseStatusText: response.statusText,
      htmlSizeBytes,
      isCompressed,
      compressionType: contentEncoding,
      cacheControl,
      scriptCount,
      stylesheetCount,
      metrics: {
        ttfbRating,
        htmlSizeRating,
      },
    },
    security: {
      isHttps,
      headers: securityHeaders,
      status: securityStatus,
    },
  };
}
