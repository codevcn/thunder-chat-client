import { createAsyncThunk } from "@reduxjs/toolkit"
import { authService } from "@/services/auth.service"

export const checkAuthThunk = createAsyncThunk("auth/checkAuth", authService.checkAuth)
