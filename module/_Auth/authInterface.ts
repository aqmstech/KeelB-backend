export interface AuthInterface {
  firstName: string,
  lastName: string,
  profileImage?: string,
  fullName?: string,
  coverImage?: string,
  address: string,
  email: string,
  password: string,
  role: number,
  pushNotification?: boolean,
  isVerified?: boolean,
  location?: {
    type: string;
    coordinates: string;
  },
  otpInfo?: {
    otp: string;
    otpExpiresIn: string;
    validatedAt?: string;
  },
  additionalFields?: any; //  ads limit
  phone: string,
  gender: string,
  dob: string,
  isDeleted?: boolean,
  isSocial?: boolean,
  platform: string,
  status: string,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: null,
}

export const statusEnum = ["ACTIVE", "DEACTIVE"];
export const AuthTypeEnum = ["email", "phone", "google", "apple", "facebook"];