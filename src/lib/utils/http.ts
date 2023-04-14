import axios from "axios";

/**
 * 
 * Utility function which converts a remote file to Buffer
 * @param url The url to the remote file
 * @returns Buffer of the remote file
 */
export const getBufferOfRemoteFile = async (url: string) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data)
}