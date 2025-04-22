import Dexie from 'dexie';

const db = new Dexie('pov_demo_app');
db.version(1).stores({
  imu_sessions: '++id,sessionId,timestamp,x,y,z',
});

export const saveImuData = async (sessionId, data) => {
  try {
    await db.imu_sessions.add({ sessionId, ...data });
  } catch (error) {
    throw new Error(`Failed to save IMU data: ${error.message}`);
  }
};

export const getLatestSessionData = async () => {
  try {
    const latestSession = await db.imu_sessions.orderBy('sessionId').last();
    if (!latestSession) return [];

    const data = await db.imu_sessions
      .where('sessionId')
      .equals(latestSession.sessionId)
      .toArray();
    return data;
  } catch (error) {
    throw new Error(`Failed to get latest session data: ${error.message}`);
  }
};

export const clearSessionData = async (sessionId) => {
  try {
    await db.imu_sessions.where('sessionId').equals(sessionId).delete();
  } catch (error) {
    throw new Error(`Failed to clear session data: ${error.message}`);
  }
};