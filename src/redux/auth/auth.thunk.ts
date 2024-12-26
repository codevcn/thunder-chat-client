import { createAsyncThunk } from "@reduxjs/toolkit"
import { authService } from "@/services/auth.service"

const checkAuthThunk = createAsyncThunk("auth/checkAuth", authService.checkAuthService)

export { checkAuthThunk }
