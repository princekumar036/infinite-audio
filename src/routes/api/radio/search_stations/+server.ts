// Import necessary modules
import { json } from '@sveltejs/kit';
import { RadioBrowserApi, type Station } from 'radio-browser-api'
const api = new RadioBrowserApi('My Radio App')

export async function GET({ url }) {
    const query = url.searchParams.get('q');
    
    if (!query) {
        return json(
            { error: 'Query parameter "q" is required' }, 
            { status: 400 }
        );
    }

    try {
        const stations = await api.searchStations({
            name: query,
            order: 'votes',
            reverse: true,
            hideBroken: true,
            limit: 5,
        })

        const formattedStations = stations.map((station) => ({
            id: station.id,
            type: "station",
            title: station.name,
            subtitle: [...station.language, ...station.tags].join(', '),
            thumbnail: station.favicon || "/placeholder.svg",
            src: station.urlResolved,
        }));

        return json(formattedStations);
    } 
    catch (error) {
        return json(
            { error: error }, 
            { status: 500 }
        );
    }
}
