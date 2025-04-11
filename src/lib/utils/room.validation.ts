export const isValidRoomId = (roomId: string): boolean => {
    // Early return for invalid input
    if (!roomId || typeof roomId !== 'string') {
        return false;
    }

    // Check if length is exactly 7 (3 letters + hyphen + 3 letters)
    if (roomId.length !== 7) {
        return false;
    }

    // Validate room ID format:
    // - Must have exactly 3 lowercase letters
    // - Must have a hyphen in the middle
    // - Must have exactly 3 lowercase letters after hyphen
    const ROOM_ID_PATTERN = /^[a-z]{3}-[a-z]{3}$/;
    
    return ROOM_ID_PATTERN.test(roomId);
};