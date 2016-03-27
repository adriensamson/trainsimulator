export function sign(number) {
    if (number > 0) {
        return 1;
    } else if (number < 0) {
        return -1;
    }
    return 0;
}

export function partitionEquals(part1, part2) {
    return (part1.removedTrack === part2.removedTrack && part1.removedPosition === part2.removedPosition &&
        part1.addedTrack === part2.addedTrack && part1.addedPosition === part2.addedPosition) ||
        (part1.removedTrack === part2.addedTrack && part1.removedPosition === part2.addedPosition &&
        part1.addedTrack === part2.removedTrack && part1.addedPosition === part2.removedPosition);
}

export function clone<T> (object : T) : T {
    var newObject = <T>{}, prop;
    for (prop in object) {
        if (object.hasOwnProperty(prop)) {
            newObject[prop] = object[prop];
        }
    }
    return newObject;
}
