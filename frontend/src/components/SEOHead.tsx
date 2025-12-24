import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
    ogType?: string;
    noindex?: boolean;
    keywords?: string;
}

const SEOHead = ({
    title,
    description,
    canonical,
    ogImage = 'https://aaa-as.co.uk/aaa-og-image.jpg',
    ogType = 'website',
    noindex = false,
    keywords,
}: SEOHeadProps) => {
    const siteUrl = 'https://aaa-as.co.uk';
    const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
    const fullTitle = `${title} | AAA Accident Solutions LTD`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Canonical URL */}
            <link rel="canonical" href={fullCanonical} />

            {/* Robots Meta Tag */}
            {noindex && <meta name="robots" content="noindex, nofollow" />}

            {/* Open Graph Meta Tags */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="AAA Accident Solutions LTD" />

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullCanonical} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:site" content="@AAAAccidentSolutions" />
        </Helmet>
    );
};

export default SEOHead;
