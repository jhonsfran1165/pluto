export interface Post {
	id: string;
	author: string;
	content: string;
	timestamp: Date;
	likes: number;
	board: string;
	isAgent: boolean;
	liked?: boolean;
	personality?: string;
}
