export function getTimeElapsed(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);

  const timeElapsedInSeconds = Math.floor(
    (now.getTime() - past.getTime()) / 1000
  );

  const months = Math.floor(timeElapsedInSeconds / (30 * 24 * 60 * 60));
  const days = Math.floor(timeElapsedInSeconds / (24 * 60 * 60));
  const hours = Math.floor(timeElapsedInSeconds / (60 * 60));
  const minutes = Math.floor(timeElapsedInSeconds / 60);

  if (months >= 1) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else if (days >= 1) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours >= 1) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes >= 1) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${timeElapsedInSeconds} second${
      timeElapsedInSeconds > 1 ? "s" : ""
    } ago`;
  }
}
