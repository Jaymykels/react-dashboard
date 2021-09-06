import { useQuery } from "@apollo/client";
import { GET_ALL_SESSIONS } from "../graph/queries";

interface GetAllSessionData {
    allSessions: Session[]
}

interface Session {
    id: string;
    lat: string;
    long: string;
}

export function useSession() {
    const { loading, error, data } = useQuery<GetAllSessionData>(GET_ALL_SESSIONS)

    const markers = data?.allSessions.map(session => ({
        coordinates: [Number(session.long), Number(session.lat)]
    })) || []

    return {loading, error, markers}
}