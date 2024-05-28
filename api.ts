import axios from 'axios';

const HN_API_URL = 'https://hacker-news.firebaseio.com/v0';

async function fetchTopStories(): Promise<number[]> {
    const response = await axios.get<number[]>(`${HN_API_URL}/topstories.json`);
    return response.data.slice(0, 20);
}

async function fetchStoryDetails(storyId: number): Promise<{ title: string }> {
    const response = await axios.get<{ title: string }>(`${HN_API_URL}/item/${storyId}.json`);
    return response.data;
}

export async function getTopStoryTitles(): Promise<string[]> {
    try {
        const topStoryIds = await fetchTopStories();
        const storyPromises = topStoryIds.map(id => fetchStoryDetails(id));
        const stories = await Promise.all(storyPromises);
        return stories.map(story => story.title);
    } catch (error) {
        console.error('Error fetching top stories:', error);
        return [];
    }
}