import { Session, sessionToMarker } from "./session";

const sessions: Session[] = [...Array(10).keys()].map(id => ({
    id: id.toString(),
    lat: (id+1).toString(),
    long: (id+2).toString()
}))

test('converts sessions to markers', () => {
    const markers = sessions.map(sessionToMarker)
    expect(markers.length).toEqual(sessions.length)
    expect(markers[0].coordinates[0].toString()).toEqual(sessions[0].long)
})