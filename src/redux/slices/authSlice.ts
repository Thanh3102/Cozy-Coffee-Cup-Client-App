import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../lib/axios";
import { toast } from "react-toastify";
import { RootState } from "../store";

export interface AuthState {
  user: { id: string; username: string; name: string } | null;
  status: "authenciation" | "unauthenciation" | "pending";
  error: string | null | unknown;
  accessToken: string | null;
}

interface SignInSuccess {
  user: { id: string; username: string; name: string };
  accessToken: string;
}

interface SignInFailed {
  user: null;
  message: string;
  status: number;
}

interface SignInData {
  username: string;
  password: string;
}

interface LogoutResponse {
  message: string;
  status: number;
}

interface RefreshSucess {
  accessToken: string;
  user: any;
}

interface RefreshFailed {
  status: number;
  message: string;
}

const initialState: AuthState = {
  user: null,
  status: "unauthenciation",
  error: null,
  accessToken: null,
};

export const signInUser = createAsyncThunk<
  SignInSuccess,
  SignInData,
  { rejectValue: SignInFailed }
>("auth/signin", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<SignInData, SignInSuccess>(
      "/auth/signin",
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error: any) {
    let err: SignInFailed = error;
    return rejectWithValue(err);
  }
});

export const logout = createAsyncThunk<
  LogoutResponse,
  void,
  { rejectValue: LogoutResponse }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post<void, LogoutResponse>(
      "/auth/logout"
    );
    return response;
  } catch (error: any) {
    let err: LogoutResponse = error;
    return rejectWithValue(err);
  }
});

export const refreshToken = createAsyncThunk<
  RefreshSucess,
  void,
  { state: RootState; rejectWithValue: RefreshFailed }
>("auth/refresh", async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const accessToken = state.auth.accessToken;
  // console.log("Access token", state.auth.accessToken);
  try {
    const response = await axiosClient.post<void, RefreshSucess>(
      "/auth/refresh",
      null,
      {
        headers: {
          authorization: accessToken,
        },
      }
    );
    // console.log(response);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.fulfilled, (state, action) => {
        state.status = "authenciation";
        state.user = action.payload.user;
        state.error = null;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(signInUser.pending, (state) => {
        state.status = "pending";
        state.user = null;
        state.error = null;
        state.accessToken = null;
      })
      .addCase(signInUser.rejected, (state, { payload }) => {
        toast.error(payload?.message);
        state.status = "unauthenciation";
        state.user = null;
        state.error = "";
        state.accessToken = null;
      })
      .addCase(logout.fulfilled, (state, { payload }) => {
        if (payload.status === 200) {
          toast.success("Đã đăng xuất");
          state.status = "unauthenciation";
          state.user = null;
          state.error = null;
          state.accessToken = null;
        }
      })
      .addCase(logout.rejected, (state, { payload }) => {
        toast.error(payload?.message);
        state.error = payload?.message;
      })
      .addCase(refreshToken.fulfilled, (state, { payload }) => {
        state.accessToken = payload.accessToken;
        state.user = payload.user;
        state.status = "authenciation";
        state.error = null;
      })
      .addCase(refreshToken.pending, (state) => {
        state.status = "pending";
      })
      .addCase(refreshToken.rejected, (state) => {
        state.accessToken = null;
        state.status = "unauthenciation";
        state.user = null;
      });
  },
});

export const {} = authSlice.actions;

export default authSlice.reducer;
