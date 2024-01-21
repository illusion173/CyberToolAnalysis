import { Auth } from "aws-amplify";

export async function fetchJwt() {
  try {
    const session = await Auth.currentSession();
    const jwt = session.getIdToken().getJwtToken();
    return jwt;
  } catch (error) {
    console.error("Error getting JWT Token:", error);
    throw error;
  }
}

export async function getUserId() {
  try {
    const User = await Auth.userAttributes();
    const username = User.getUsername();
    return username;
  } catch (error) {
    console.error("Error getting a cognito ID for user.");
  }
}
