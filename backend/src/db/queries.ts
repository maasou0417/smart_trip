import { pool } from "../db";
import {
  User,
  Trip,
  Activity,
  CreateUserDto,
  CreateTripDto,
  CreateActivityDto,
  UpdateTripDto,
  UpdateActivityDto,
} from "../types";



// USER QUERIES  - 

export const createUser = async (userData: CreateUserDto): Promise<User> => {
  const { email, password, name } = userData;
  const result = await pool.query(
    "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *",
    [email, password, name]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0] || null;
};

export const findUserById = async (id: number): Promise<User | null> => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
};


// TRIP QUERIES

export const createTrip = async (
  userId: number,
  tripData: CreateTripDto
): Promise<Trip> => {
  const { title, destination, start_date, end_date } = tripData;
  const result = await pool.query(
    `INSERT INTO trips (user_id, title, destination, start_date, end_date) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, title, destination, start_date, end_date]
  );
  return result.rows[0];
};

export const getTripsByUserId = async (userId: number): Promise<Trip[]> => {
  const result = await pool.query(
    "SELECT * FROM trips WHERE user_id = $1 ORDER BY start_date DESC",
    [userId]
  );
  return result.rows;
};

export const getTripById = async (
  tripId: number,
  userId: number
): Promise<Trip | null> => {
  const result = await pool.query(
    "SELECT * FROM trips WHERE id = $1 AND user_id = $2",
    [tripId, userId]
  );
  return result.rows[0] || null;
};

export const updateTrip = async (
  tripId: number,
  userId: number,
  updates: UpdateTripDto
): Promise<Trip | null> => {

  // dynamisk UPDATE query
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) {
    return getTripById(tripId, userId);
  }

  const setClause = fields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");

  const result = await pool.query(
    `UPDATE trips SET ${setClause} WHERE id = $${fields.length + 1} AND user_id = $${fields.length + 2} RETURNING *`,
    [...values, tripId, userId]
  );

  return result.rows[0] || null;
};

export const deleteTrip = async (
  tripId: number,
  userId: number
): Promise<boolean> => {
  const result = await pool.query(
    "DELETE FROM trips WHERE id = $1 AND user_id = $2",
    [tripId, userId]
  );
  return result.rowCount !== null && result.rowCount > 0;
};



// ACTIVITY QUERIES

export const createActivity = async (
  activityData: CreateActivityDto
): Promise<Activity> => {
  const { trip_id, day_number, title, description, time } = activityData;
  const result = await pool.query(
    `INSERT INTO activities (trip_id, day_number, title, description, time) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [trip_id, day_number, title, description || null, time || null]
  );
  return result.rows[0];
};

export const getActivitiesByTripId = async (
  tripId: number
): Promise<Activity[]> => {
  const result = await pool.query(
    "SELECT * FROM activities WHERE trip_id = $1 ORDER BY day_number, time",
    [tripId]
  );
  return result.rows;
};

export const updateActivity = async (
  activityId: number,
  updates: UpdateActivityDto
): Promise<Activity | null> => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) {
    const result = await pool.query(
      "SELECT * FROM activities WHERE id = $1",
      [activityId]
    );
    return result.rows[0] || null;
  }

  const setClause = fields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");

  const result = await pool.query(
    `UPDATE activities SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, activityId]
  );

  return result.rows[0] || null;
};

export const deleteActivity = async (activityId: number): Promise<boolean> => {
  const result = await pool.query("DELETE FROM activities WHERE id = $1", [
    activityId,
  ]);
  return result.rowCount !== null && result.rowCount > 0;
};


// COMBINED QUERIES (För att få trip med alla activities)

export const getTripWithActivities = async (
  tripId: number,
  userId: number
) => {
  const trip = await getTripById(tripId, userId);
  if (!trip) return null;

  const activities = await getActivitiesByTripId(tripId);

  return {
    ...trip,
    activities,
  };
};