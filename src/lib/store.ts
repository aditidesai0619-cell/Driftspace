"use client";
import { create } from "zustand";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface TopicBriefing {
  oneLiner: string;
  physicsExplained: string;
  keyStats: { label: string; value: string; unit: string }[];
  unsolvedMystery: string;
  realMissions: { name: string; agency: string; year: number; finding: string }[];
}

export interface NotFoundData {
  query: string;
  type: string;
  parentBody?: string;
  description: string;
  relatedSlugs: string[];
  relatedCatalogIds: string[];
}

interface DriftspaceStore {
  // Nerd level toggle
  nerdLevel: boolean;
  setNerdLevel: (v: boolean) => void;
  toggleNerdLevel: () => void;

  // Briefing cache: slug -> TopicBriefing
  briefings: Record<string, TopicBriefing>;
  setBriefing: (slug: string, data: TopicBriefing) => void;

  // Catalog briefing cache: id -> TopicBriefing
  catalogBriefings: Record<string, TopicBriefing>;
  setCatalogBriefing: (id: string, data: TopicBriefing) => void;

  // Chat history per topic
  chatHistories: Record<string, Message[]>;
  addMessage: (slug: string, msg: Message) => void;
  clearChat: (slug: string) => void;

  // Roadmap drawer
  drawerTopicSlug: string | null;
  setDrawerTopicSlug: (slug: string | null) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Context note shown on topic/object pages after a search
  contextNote: string | null;
  setContextNote: (note: string | null) => void;

  // Not-found search result data
  notFoundSearch: NotFoundData | null;
  setNotFoundSearch: (data: NotFoundData | null) => void;

  // Global glossary term modal
  glossaryModalTermId: string | null;
  setGlossaryModalTermId: (id: string | null) => void;

  // Global glossary "Ask AI" floating chat trigger
  glossaryChatActive: string | null;
  setGlossaryChatActive: (id: string | null) => void;
}

export const useDriftspaceStore = create<DriftspaceStore>((set) => ({
  nerdLevel: false,
  setNerdLevel: (v) => set({ nerdLevel: v }),
  toggleNerdLevel: () => set((s) => ({ nerdLevel: !s.nerdLevel })),

  briefings: {},
  setBriefing: (slug, data) =>
    set((s) => ({ briefings: { ...s.briefings, [slug]: data } })),

  catalogBriefings: {},
  setCatalogBriefing: (id, data) =>
    set((s) => ({ catalogBriefings: { ...s.catalogBriefings, [id]: data } })),

  chatHistories: {},
  addMessage: (slug, msg) =>
    set((s) => ({
      chatHistories: {
        ...s.chatHistories,
        [slug]: [...(s.chatHistories[slug] ?? []), msg],
      },
    })),
  clearChat: (slug) =>
    set((s) => ({
      chatHistories: { ...s.chatHistories, [slug]: [] },
    })),

  drawerTopicSlug: null,
  setDrawerTopicSlug: (slug) => set({ drawerTopicSlug: slug }),

  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),

  contextNote: null,
  setContextNote: (note) => set({ contextNote: note }),

  notFoundSearch: null,
  setNotFoundSearch: (data) => set({ notFoundSearch: data }),

  glossaryModalTermId: null,
  setGlossaryModalTermId: (id) => set({ glossaryModalTermId: id }),

  glossaryChatActive: null,
  setGlossaryChatActive: (id) => set({ glossaryChatActive: id }),
}));
