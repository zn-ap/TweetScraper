import needle from "needle";

const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

export async function getRequest(token: string) {

    // Edit query parameters below
    // specify a search query, and any additional fields that are required
    // by default, only the Tweet ID and text fields are returned
    const params = {
        'query': '"sim bhullar" lang:en -is:retweet -is:reply -is:quote -"Dwight Howard"',
        'tweet.fields': 'author_id,created_at'
    }

    const res = await needle('get', endpointUrl, params, {
        headers: {
            "User-Agent": "v2RecentSearchJS",
            "authorization": `Bearer ${token}`
        }
    })

    if (res.body) {
        return res.body;
    } else {
        throw new Error('Unsuccessful request');
    }
}
