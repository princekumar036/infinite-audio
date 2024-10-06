import { json } from '@sveltejs/kit';
import { RadioBrowserApi, type Station } from 'radio-browser-api'
const api = new RadioBrowserApi('My Radio App')

export async function GET({ url }) {
    const ids = url.searchParams.get('ids');
    
    if (!ids) {
        return json(
            { error: 'Query parameter "ids" is required' }, 
            { status: 400 }
        );
    }

    const idsArr = ids.split(',');
    if (!Array.isArray(idsArr) || idsArr.length === 0) {
        return json({ error: 'Query parameter "ids" should be an array' }, { status: 400 });
    }

    try {
        const stations = await api.getStationsById(idsArr)

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
