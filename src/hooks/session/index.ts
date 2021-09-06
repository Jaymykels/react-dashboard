import { useQuery } from "@apollo/client";
import { GET_ALL_SESSIONS } from "../../graph/queries";

interface GetAllSessionData {
    allSessions: Session[]
}

export interface Session {
    id: string;
    lat: string;
    long: string;
}

export const sessionToMarker = (session: Session): {coordinates: number[]} => ({ coordinates: [Number(session.long), Number(session.lat)]})

export function useSession() {
    const { loading, error, data } = useQuery<GetAllSessionData>(GET_ALL_SESSIONS)

    const markers = data?.allSessions.map(sessionToMarker) || []

    return {loading, error, markers}
}