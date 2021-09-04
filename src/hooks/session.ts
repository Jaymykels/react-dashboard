import {
    useQuery,
    gql
} from "@apollo/client";

interface GetAllSessionData {
    allSessions: Session[]
}

interface Session {
    id: string;
    lat: string;
    long: string;
}


const GET_ALL_SESSIONS = gql`
    query GetAllSessions {
        allSessions {
            id
            lat
            long
        }
    }
`;

export function useSession() {
    const { loading, error, data } = useQuery<GetAllSessionData>(GET_ALL_SESSIONS)

    const markers = data?.allSessions.map(session => ({
        coordinates: [Number(session.long), Number(session.lat)]
    })) || []

    return {loading, error, markers}
}