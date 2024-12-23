import { useCallback } from 'react';

const GOOGLE_API_KEY = "AIzaSyBan9Z3LQ3MlzNjKypztVZxR8Z5-YAW_Vc";
const GOOGLE_CLIENT_ID = "563533938078-9c4h92mat7s939a3l2i5nuq0083bgef8.apps.googleusercontent.com";

export const useDriveApi = () => {
  const initClient = useCallback(async () => {
    return new Promise((resolve, reject) => {
      if (!window.gapi) {
        reject(new Error('Google API not loaded'));
        return;
      }

      window.gapi.load('client:auth2', async () => {
        try {
          await window.gapi.client.init({
            apiKey: GOOGLE_API_KEY,
            clientId: GOOGLE_CLIENT_ID,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            scope: 'https://www.googleapis.com/auth/drive.readonly'
          });

          const isSignedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get();
          if (!isSignedIn) {
            await window.gapi.auth2.getAuthInstance().signIn();
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }, []);

  const listFiles = useCallback(async () => {
    try {
      const response = await window.gapi.client.drive.files.list({
        q: "mimeType contains 'video/'",
        fields: 'files(id, name, mimeType, size, webContentLink)',
        orderBy: 'modifiedTime desc'
      });

      return response.result.files;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }, []);

  const getFileUrl = useCallback(async (fileId) => {
    try {
      const response = await window.gapi.client.drive.files.get({
        fileId: fileId,
        fields: 'webContentLink'
      });

      return response.result.webContentLink;
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  }, []);

  return { initClient, listFiles, getFileUrl };
}; 
