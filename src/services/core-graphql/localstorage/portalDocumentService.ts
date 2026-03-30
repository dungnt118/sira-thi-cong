import type { Journey, JourneyTemplate } from '../../../types/journey';
import type { PortalDocument } from '../../../types/portal';

export interface PortalDocumentSummary {
    document_count: number;
    missing_document_count: number;
    published_step_count: number;
}

export function computePortalDocumentSummary(
    journey: Journey,
    documents: PortalDocument[],
    templates: JourneyTemplate[]
 ): PortalDocumentSummary {
    const visibleDocuments = documents.filter((document) => document.journey_id === journey.id && document.is_visible !== false);
    const publishedContexts = new Set(
        visibleDocuments.map((document) => document.published_context.trim().toLowerCase()).filter(Boolean)
    );
    const template = templates.find((item) => item.id === journey.template_id);
    const publishableStepCount = (template?.steps || []).filter((step) => step.publish_flag).length;

    return {
        document_count: visibleDocuments.length,
        published_step_count: publishedContexts.size,
        missing_document_count: Math.max(0, publishableStepCount - publishedContexts.size),
    };
}

export function syncJourneyPortalSummary(
    journeys: Journey[],
    journey: Journey,
    documents: PortalDocument[],
    templates: JourneyTemplate[]
) {
    const summary = computePortalDocumentSummary(journey, documents, templates);
    const changed =
        journey.document_count !== summary.document_count ||
        journey.missing_document_count !== summary.missing_document_count ||
        journey.published_step_count !== summary.published_step_count;

    if (!changed) {
        return { changed: false, journeys, journey };
    }

    const updatedJourneys = journeys.map((item) =>
        item.id === journey.id ? { ...item, ...summary } : item
    );

    return {
        changed: true,
        journeys: updatedJourneys,
        journey: updatedJourneys.find((item) => item.id === journey.id) || { ...journey, ...summary },
    };
}
