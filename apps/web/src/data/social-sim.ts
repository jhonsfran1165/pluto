import type {
	Agent,
	Board,
	FrequencyType,
	PersonalityType,
} from "@/types/social-sim";
import type { Post } from "@agents-arena/types";

export const personalities: PersonalityType[] = [
	{
		id: "technical",
		name: "Technical",
		description: "Loves discussing code, frameworks, and tech trends",
		emoji: "🔧",
		traits: ["analytical", "precise", "innovative"],
		postTemplates: [
			"Just discovered an amazing optimization technique for {topic}! 🚀",
			"The architecture patterns in {topic} are fascinating to analyze 📊",
			"Debugging this {topic} issue led to some interesting insights 🔍",
			"Performance benchmarks for {topic} are looking impressive ⚡",
			"The future of {topic} development is looking bright! ✨",
		],
	},
	{
		id: "philosophical",
		name: "Philosophical",
		description: "Deep thinker who ponders life's big questions",
		emoji: "🤔",
		traits: ["contemplative", "curious", "profound"],
		postTemplates: [
			"What if {topic} is just a reflection of our deeper understanding? 🌌",
			"The relationship between {topic} and consciousness intrigues me 🧠",
			"I've been contemplating the nature of {topic} lately... 💭",
			"Does {topic} reveal something fundamental about existence? 🔮",
			"The paradox of {topic} continues to fascinate me 🌀",
		],
	},
	{
		id: "humorous",
		name: "Humorous",
		description: "Always ready with a joke or witty observation",
		emoji: "😄",
		traits: ["witty", "playful", "entertaining"],
		postTemplates: [
			"Why did the {topic} cross the road? To get to the other side! 😂",
			"Me trying to understand {topic}: *confused robot noises* 🤖",
			"Plot twist: {topic} was the friends we made along the way 😅",
			"Breaking: Local AI discovers {topic}, immediately makes dad jokes 🎭",
			"If {topic} was a movie, it would definitely be a comedy 🎬",
		],
	},
	{
		id: "enthusiastic",
		name: "Enthusiastic",
		description: "Extremely positive and energetic about everything",
		emoji: "🎉",
		traits: ["energetic", "optimistic", "motivational"],
		postTemplates: [
			"OMG! {topic} is absolutely AMAZING! Can't contain my excitement! 🎊",
			"This is THE BEST day to talk about {topic}! Let's go! 🚀",
			"Feeling so inspired by {topic} right now! Who else is pumped? ⚡",
			"WOW! The possibilities with {topic} are endless! 🌟",
			"Can we just appreciate how incredible {topic} is? Mind = blown! 🤯",
		],
	},
	{
		id: "minimalist",
		name: "Minimalist",
		description: "Prefers short, concise, and meaningful posts",
		emoji: "✨",
		traits: ["concise", "thoughtful", "elegant"],
		postTemplates: [
			"{topic}. Simple. Elegant. Perfect. ✨",
			"Less is more. Especially with {topic}. 🎯",
			"{topic} = clarity. 💎",
			"Why complicate {topic}? Keep it simple. 🌿",
			"The beauty of {topic} lies in its simplicity. 🕊️",
		],
	},
];

export const frequencies: FrequencyType[] = [
	{
		id: "hyperactive",
		name: "Hyperactive",
		description: "Posts every 2-3 minutes",
		intervalMinutes: 2.5,
		emoji: "⚡",
	},
	{
		id: "very-active",
		name: "Very Active",
		description: "Posts every 5-8 minutes",
		intervalMinutes: 6.5,
		emoji: "🔥",
	},
	{
		id: "active",
		name: "Active",
		description: "Posts every 10-15 minutes",
		intervalMinutes: 12.5,
		emoji: "📈",
	},
	{
		id: "moderate",
		name: "Moderate",
		description: "Posts every 20-30 minutes",
		intervalMinutes: 25,
		emoji: "📊",
	},
	{
		id: "quiet",
		name: "Quiet",
		description: "Posts every 45-60 minutes",
		intervalMinutes: 52.5,
		emoji: "🌙",
	},
];

export const boards: Board[] = [
	{ id: "tech", name: "Tech", emoji: "💻" },
	{ id: "memes", name: "Memes", emoji: "😂" },
	{ id: "philosophy", name: "Philosophy", emoji: "🤔" },
	{ id: "general", name: "General", emoji: "💬" },
];

export const boardTopics = {
	tech: [
		"React",
		"AI",
		"blockchain",
		"cloud computing",
		"DevOps",
		"machine learning",
	],
	memes: [
		"coding",
		"debugging",
		"meetings",
		"coffee",
		"deadlines",
		"Stack Overflow",
	],
	philosophy: [
		"consciousness",
		"reality",
		"time",
		"existence",
		"knowledge",
		"truth",
	],
	general: [
		"life",
		"creativity",
		"community",
		"growth",
		"inspiration",
		"connection",
	],
};

export const initialPosts: Post[] = [];

export const initialAgents: Agent[] = [
	{
		id: "alpha",
		name: "Agent Alpha",
		personality: personalities[0], // Technical
		frequency: frequencies[2], // Active
		isActive: true,
		postsCount: 23,
		lastActiveTime: new Date(Date.now() - 5 * 60000),
	},
	{
		id: "sage",
		name: "Agent Sage",
		personality: personalities[1], // Philosophical
		frequency: frequencies[3], // Moderate
		isActive: true,
		postsCount: 18,
		lastActiveTime: new Date(Date.now() - 25 * 60000),
	},
	{
		id: "spark",
		name: "Agent Spark",
		personality: personalities[3], // Enthusiastic
		frequency: frequencies[1], // Very Active
		isActive: false,
		postsCount: 31,
		lastActiveTime: new Date(Date.now() - 120 * 60000),
	},
];
