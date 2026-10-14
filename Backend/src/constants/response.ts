const HTTP_STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    UPDATED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    ACCESS_FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    UNREGISTERED: 410,
    PAYLOAD_TOO_LARGE: 413,
    CONCURRENT_LIMITED_EXCEEDED: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SHUTDOWN: 503,
    ACCOUNT_NOT_VERIFIED: 601,
    EMAIL_NOT_VERIFIED: 602,
    MOBILE_NOT_VERIFIED: 603,
    FRIEND_REQUEST_ERR: 604,
    FAV_USER_NOT_FOUND: 605,
};

export const RESPONSE_MESSAGES = {
    ERROR: {
        UNAUTHORIZED_ACCESS: {
            "statusCode": HTTP_STATUS_CODE.UNAUTHORIZED,
            "type": "UNAUTHORIZED_ACCESS",
            "message": "unauthorized access Token "

        },
        ACCESS_FORBIDDEN: {
            "statusCode": HTTP_STATUS_CODE.ACCESS_FORBIDDEN,
            "type": "ACCESS_FORBIDDEN"
        },
        INTERNAL_SERVER_ERROR: {
            "statusCode": HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            "type": "INTERNAL_SERVER_ERROR",
            "message": "Internal Server Error"
        },
        BAD_TOKEN: {
            "statusCode": HTTP_STATUS_CODE.UNAUTHORIZED,
            "type": "BAD_TOKEN"
        },
        TOKEN_EXPIRED: {
            "statusCode": HTTP_STATUS_CODE.UNAUTHORIZED,
            "type": "TOKEN_EXPIRED"
        },
        TOKEN_GENERATE_ERROR: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "TOKEN_GENERATE_ERROR"
        },
        BLOCKED: {
            "statusCode": HTTP_STATUS_CODE.UNAUTHORIZED,
            "type": "BLOCKED"
        },
        INCORRECT_PASSWORD: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "INCORRECT_PASSWORD",
            "message": "incorrect password"
        },
        INCORRECT_OLD_PASSWORD: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "INCORRECT_OLD_PASSWORD",
            "message": "incorrect old password"
        },
        OLD_PASSWORD_REQUIRED: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "OLD_PASSWORD_REQUIRED",
            "message": "old password is required"
        },
        SIMILAR_PASSWORD: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "SIMILAR_PASSWORD"
        },
        BLOCKED_MOBILE: {
            "statusCode": HTTP_STATUS_CODE.UNAUTHORIZED,
            "type": "BLOCKED_MOBILE"
        },
        SESSION_EXPIRED: {
            "statusCode": HTTP_STATUS_CODE.UNAUTHORIZED,
            "type": "SESSION_EXPIRED"
        },
        FAV_USER_NOT_FOUND: {
            "statusCode": HTTP_STATUS_CODE.FAV_USER_NOT_FOUND,
            "type": "FAV_NOT_FOUND"
        },
        ERROR: (value: any, code = HTTP_STATUS_CODE.BAD_REQUEST) => {
            return {
                "statusCode": code,
                "message": value,
                "type": "ERROR"
            };
        },
        FRIEND_ERROR: (value: any, code = HTTP_STATUS_CODE.FRIEND_REQUEST_ERR) => {
            return {
                "statusCode": code,
                "message": value,
                "type": "ERROR"
            };
        },


        SOMETHING_WENT_WRONG: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "SOMETHING_WENT_WRONG"
        },

        EMAIL_NOT_REGISTERED: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "EMAIL_NOT_REGISTERED"
        },
        EMAIL_NOT_REGISTERED_YET: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "EMAIL_NOT_REGISTERED_YET"
        },
        INVALID_BODY: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "INVALID BODY PARAMETER"
        },
        EMAIL_ALREADY_EXIST: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "EMAIL_ALREADY_EXIST"
        },
        PAGE_TYPE_ALREADY_EXISTS: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "PAGE_TYPE_ALREADY_EXISTS",
            "message": "Page type already exists"
        },
        EMAIL_ALREADY_VERIFIED: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "EMAIL_ALREADY_VERIFIED",
            "message": "Email already verified"
        },
        EMAIL_NOT_VERIFIED:
        {
            "statusCode": HTTP_STATUS_CODE.EMAIL_NOT_VERIFIED,
            "type": "EMAIL_NOT_VERIFIED",
            "message": "Email not verified, we have sent a verification code to your email."
        },


        ACCOUNT_NOT_VERIFIED:
        {
            "statusCode": HTTP_STATUS_CODE.EMAIL_NOT_VERIFIED,
            "type": "ACCOUNT_NOT_VERIFIED"
        },
        INACTIVE_ACCOUNT: {
            "statusCode": HTTP_STATUS_CODE.ACCESS_FORBIDDEN,
            "type": "INACTIVE_ACCOUNT",
            "message": "Account is inactive, please contact support team."
        },

        NEW_CONFIRM_PASSWORD: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "NEW_CONFIRM_PASSWORD"
        },
        INCURRECT_FINGERPRINT: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "INVALID_FINGERPRINT",
            "message": "Invalid fingerprint"
        },
        INCURRECT_FACEID: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "INVALID_FACEID",
            "message": "Invalid face ID"
        },
        NEW_PASSWORD_REQUIRED: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "NEW_PASSWORD_REQUIRED",
            "message": "New password is required to reset your password."
        },
        OTP_EXPIRED: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "OTP_EXPIRED",
            "message": "OTP Expired"
        },
        INVALID_OTP: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "INVALID_OTP",
            "message": "Invalid OTP"
        },
        // user specific
        USER_NOT_FOUND: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "USER_NOT_FOUND",
            "message": "User not found"
        },
        PAGE_NOT_FOUND: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "PAGE_NOT_FOUND",
            "message": "Page not found"
        },
        PROFILE_NOT_COMPLETED: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "PROFILE_NOT_COMPLETED"
        },
        DOCUMENT_NOT_APPROVED: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "DOCUMENT_NOT_APPROVED"
        },
        MOBILE_NO_NOT_VERIFIED: {
            "statusCode": HTTP_STATUS_CODE.MOBILE_NOT_VERIFIED,
            "type": "MOBILE_NO_NOT_VERIFIED"
        },
        MOBILE_NO_ALREADY_EXIST: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "MOBILE_NO_ALREADY_EXIST"
        },
        MOBILE_NO_NOT_REGISTERED: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "MOBILE_NO_NOT_REGISTERED"
        },
        USERNAME_ALREADY_EXIST: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "USERNAME_ALREADY_EXIST",
            "message": "User already exist"
        },
        // content specific
        CONTENT_ALREADY_EXIST: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "CONTENT_ALREADY_EXIST"
        },
        CONTENT_NOT_FOUND: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "CONTENT_NOT_FOUND"
        },
        COMMENT_NOT_FOUND: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "COMMENT_NOT_FOUND"
        },
        CONVERSATION_NOT_FOUND: {
            "statusCode": HTTP_STATUS_CODE.NOT_FOUND,
            "type": "CONVERSATION_NOT_FOUND"
        },
        PRE_DEFINED_CONTENT_CANNOT_BE_DELETED: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "PRE_DEFINED_CONTENT_CANNOT_BE_DELETED"
        },
        FAQ_ALREADY_EXIST: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "FAQ_ALREADY_EXIST"
        },

        GROUP_ALREADY_JOINED: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "GROUP_ALREADY_JOINED"
        },
        // interest specific
        INTEREST_ALREADY_EXIST: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "INTEREST_ALREADY_EXIST"
        },
        INTEREST_NOT_FOUND: {
            statusCode: HTTP_STATUS_CODE.NOT_FOUND,
            type: "INTEREST_NOT_FOUND"
        },
        CANT_BLOCK_INTEREST: {
            statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
            type: "CANT_BLOCK_INTEREST"
        },
        // categories specific
        CATEGORY_ALREADY_EXIST: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "CATEGORY_ALREADY_EXIST"
        },
        CATEGORY_NOT_FOUND: {
            statusCode: HTTP_STATUS_CODE.NOT_FOUND,
            type: "CATEGORY_NOT_FOUND"
        },
        CANT_BLOCK_CATEGORY: {
            statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
            type: "CANT_BLOCK_CATEGORY"
        },
        // version Specific
        VERSION_ALREADY_EXIST: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "VERSION_ALREADY_EXIST"
        },

        INVALID_ADMIN: {
            "statusCode": HTTP_STATUS_CODE.UNAUTHORIZED,

            "type": "INVALID_ADMIN"
        },
        ROLE_ALREADY_EXIST: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,

            "type": "ROLE_ALREADY_EXIST"
        },
        REQUEST_ALREADY_SENT: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "REQUEST_ALREADY_SENT"
        },
        REQUEST_NOT_FOUND: {
            "statusCode": HTTP_STATUS_CODE.NOT_FOUND,
            "type": "REQUEST_NOT_FOUND"
        },
        INVALID_ROLE_ID: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,

            "type": "INVALID_ROLE_ID"
        },

        INVALID_SUB_ADMIN: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,

            "type": "INVALID_SUB_ADMIN"
        },
        ROLE_IS_BLOCKED: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,

            "type": "ROLE_IS_BLOCKED"
        },
        IN_VALID_LINK: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "IN_VALID_LINK"
        },
        POST_NOT_FOUND: {
            "statusCode": HTTP_STATUS_CODE.NOT_FOUND,
            "type": "POST_NOT_FOUND"
        },
        STORY_NOT_FOUND: {
            "statusCode": HTTP_STATUS_CODE.NOT_FOUND,
            "type": "STORY_NOT_FOUND"
        },
        GROUP_NOT_FOUND: {
            "statusCode": HTTP_STATUS_CODE.NOT_FOUND,
            "type": "GROUP_NOT_FOUND"
        },
        USER_NOT_FOUND_IN_GROUP: {
            "statusCode": HTTP_STATUS_CODE.NOT_FOUND,
            "type": "USER_NOT_FOUND_IN_GROUP"
        },
        FAQ_NOT_FOUND: {
            "statusCode": HTTP_STATUS_CODE.NOT_FOUND,
            "type": "FAQ_NOT_FOUND"
        },
        DEVICE_ID_REQUIRED: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "DEVICE_ID_REQUIRED",
            "message": "Device ID is required for device verification."
        },
        DEVICE_VERIFICATION: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "DEVICE_VERIFICATION",
            "message": "New device detected. Please verify via OTP sent to your email."
        },
        INVALID_TYPE: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "INVALID_TYPE",
            "message": "Invalid verification type."
        },
        REASON_REQUIRED: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "REASON_REQUIRED",
            "message": "Reason is required."
        },
        MPIN_NOT_MATCHED: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "MPIN_NOT_MATCHED",
            "message": "MPIN is not matched."
        },
        NEW_MPIN_REQUIRED: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "NEW_MPIN_REQUIRED",
            "message": "New MPIN required"
        },
        MPIN_NOT_SET: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "MPIN_NOT_SET",
            "message": "MPIN not set"
        },
        INCORRECT_OLD_MPIN: {
            "statusCode": HTTP_STATUS_CODE.BAD_REQUEST,
            "type": "INCORRECT_OLD_MPIN",
            "message": "Old MPIN is incorrect"
        }
    },
    SUCCESS: {
        DEFAULT: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "DEFAULT"
        },
        PAGE_UPDATED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "PAGE_UPDATED",
            "message": "page update sucessfully"
        },
        PAGE_DELETED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "PAGE_DELETED",
            "message": "page deleted sucessfully"
        },
        DETAILS: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "type": "DEFAULT",
                "data": data
            };
        },
        LIST: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "type": "DEFAULT",
                ...data
            };
        },
        SEND_OTP: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "SEND_OTP",
            "message": "OTP sent successfully"
        },
        RESEND_OTP: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "RESEND_OTP",
            "message": "OTP resent successfully"
        },
        MAIL_SENT: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "MAIL_SENT"
        },
        MAIL_LINK_SENT: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "MAIL_LINK_SENT"
        },
        VALID_LINK: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "VALID_LINK"
        },
        VERIFY_OTP: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "type": "VERIFY_OTP",
                "data": data
            };
        },

        DEVICE_VERIFIED: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "type": "DEVICE_VERIFIED",
                "data": data
            }
        },
        GET_USERS: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "type": "GET_USERS",
                "data": data
            }
        },
        GET_QUERIES: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "type": "GET_QUERIES",
                "data": data
            }
        },
        GET_STATS: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "type": "GET_STATS",
                "data": data
            }
        },
        GET_BANNERS: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "type": "GET_BANNERS",
                "data": data
            }
        },
        BANNER_CREATED: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.CREATED,
                "type": "BANNER_CREATED",
                "message": "Banner created successfully",
                "data": data
            }
        },
        BANNER_UPDATED: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "type": "BANNER_UPDATED",
                "message": "Banner updated successfully",
                "data": data
            }
        },
        BANNER_DELETED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "BANNER_DELETED",
            "message": "Banner deleted successfully"
        },
        USER_DEACTIVATED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "USER_DEACTIVATED",
            "message": "User deactivated successfully"
        },
        USER_REACTIVATED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "USER_REACTIVATED",
            "message": "User reactivated successfully"
        },

        INTEREST_UPDATE: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "INTEREST_UPDATE",
        },
        RESET_PASSWORD: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "RESET_PASSWORD",
            "message": "Password reset successfully"
        },
        MAKE_PUBLIC_SHIFT: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "MAKE_PUBLIC_SHIFT"
        },
        CHANGE_PASSWORD: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "CHANGE_PASSWORD"
        },
        EDIT_PROFILE: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "EDIT_PROFILE"
        },
        // admin specific
        ADMIN_LOGIN: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "type": "ADMIN_LOGIN",
                "data": data
            };
        },
        LOGOUT: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "LOGOUT"
        },
        // notification specific
        NOTIFICATION_DELETED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "NOTIFICATION_DELETED"
        },
        NOTIFICATION_MARK_READ: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "NOTIFICATION_MARK_READ"
        },
        MESSAGE_SENT: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "MESSAGE_SENT"
        },
        // content specific
        ADD_CONTENT: {
            "statusCode": HTTP_STATUS_CODE.CREATED,
            "type": "ADD_CONTENT"
        },
        DELETE_FAQ: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "DELETE_FAQ"
        },
        EDIT_CONTENT: {
            "statusCode": HTTP_STATUS_CODE.UPDATED,
            "type": "EDIT_CONTENT"
        },
        DELETED_CONTENT: {
            "statusCode": HTTP_STATUS_CODE.UPDATED,
            "type": "DELETED_CONTENT"
        },
        BLOCKED_CONTENT: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "BLOCKED_CONTENT"
        },
        UNBLOCKED_CONTENT: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "UNBLOCKED_CONTENT"
        },
        // user specific
        SIGNUP: (data: any, code = HTTP_STATUS_CODE.CREATED) => {
            return {
                "statusCode": code,
                "type": "SIGNUP",
                "data": data
            };
        },
        LOGIN: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "type": "LOGIN",
                "data": data
            };
        },
        USER_DETAILS_FETCHED: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "type": "USER_DETAILS_FETCHED",
                "data": data
            };
        },
        GET_MESH: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "type": "GET_MESH",
                "data": data
            };
        },
        CREATE_PAGE: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "type": "CREATE_PAGE",
                "message": "Page created successfully",
                "data": data
            };

        },
        GET_PAGES: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "type": "GET_PAGES",
                "data": data
            };
        },
        CONTACT_US: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "type": "CONTACT_US",
                "message": "Message sent successfully",
                "data": data
            };
        },
        QUERY_DELETED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "QUERY_DELETED",
            "message": "Query deleted successfully"
        },
        EMAIL_SENT: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "EMAIL_SENT"
        },
        USER_LOGOUT: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "USER_LOGOUT"
        },
        BLOCK_USER: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "BLOCK_USER"
        },
        FAQ_BLOCKED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "FAQ_BLOCKED"
        },
        FAQ_UNBLOCKED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "FAQ_UNBLOCKED"
        },
        UNBLOCK_USER: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "UNBLOCK_USER"
        },
        VERIFICATION_APPROVED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "VERIFICATION_APPROVED"
        },
        VERIFICATION_REJECTED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "VERIFICATION_REJECTED"
        },
        ADD_PHOTO: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "ADD_PHOTO"
        },
        SET_INTEREST: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "SET_INTEREST"
        },
        EDIT_DISABILITY_DETAILS: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "EDIT_DISABILITY_DETAILS"
        },
        EMAIL_UPLOAD: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "EMAIL_UPLOAD"
        },
        EDIT_PAYMENT_DETAILS: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "EDIT_PAYMENT_DETAILS"
        },
        EDIT_EMERGENCY_CONTACT: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "EDIT_EMERGENCY_CONTACT"
        },
        EDIT_NDIS_PLAN: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "EDIT_NDIS_PLAN"
        },
        UPLOAD_SUPPORTING_DOCUMENT: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "UPLOAD_SUPPORTING_DOCUMENT"
        },
        UPLOAD_CERTIFICATIONS: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "UPLOAD_CERTIFICATIONS"
        },
        UPLOAD_NDIS_PLAN: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "UPLOAD_NDIS_PLAN"
        },
        UPLOAD_RESUME: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "UPLOAD_RESUME"
        },
        UPLOAD_INDUCTION_CERTIFICATES: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "UPLOAD_INDUCTION_CERTIFICATES"
        },
        UPLOAD_NDIS_TRAINING_CERTIFICATE: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "UPLOAD_NDIS_TRAINING_CERTIFICATE"
        },
        UPLOAD_CAR_INSURANCE: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "UPLOAD_CAR_INSURANCE"
        },
        LIKE_USER: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "LIKE_USER"
        },
        UNLIKE_USER: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "UNLIKE_USER"
        },
        PROFILE_SETTINGS: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "PROFILE_SETTINGS"
        },
        PROFILE_IMAGE: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "PROFILE_IMAGE"
        },
        ADD_DISEASE: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "ADD_DISEASE"
        },
        RATE_SUPPORTER: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "RATE_SUPPORTER"
        },
        // version specific
        ADD_VERSION: {
            "statusCode": HTTP_STATUS_CODE.CREATED,
            "type": "ADD_VERSION"
        },
        ADD_MESH_TERM: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "ADD_MESH_TERM",
            "message": "MESH_TERM added successfully",
        },
        DELETE_VERSION: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "DELETE_VERSION"
        },
        EDIT_VERSION: {
            "statusCode": HTTP_STATUS_CODE.UPDATED,
            "type": "EDIT_VERSION"
        },
        // interest specific
        ADD_INTEREST: {
            "statusCode": HTTP_STATUS_CODE.CREATED,
            "type": "ADD_INTEREST"
        },
        BLOCK_INTEREST: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "BLOCK_INTEREST"
        },
        UNBLOCK_INTEREST: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "UNBLOCK_INTEREST"
        },
        UNFRIEND: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "UNFRIEND"
        },
        EDIT_INTEREST: {
            "statusCode": HTTP_STATUS_CODE.UPDATED,
            "type": "EDIT_INTEREST"
        },
        // category specific
        ADD_CATEGORY: {
            "statusCode": HTTP_STATUS_CODE.CREATED,
            "type": "ADD_CATEGORY"
        },
        BLOCK_CATEGORY: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "BLOCK_CATEGORY"
        },
        UNBLOCK_CATEGORY: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "UNBLOCK_CATEGORY"
        },
        EDIT_CATEGORY: {
            "statusCode": HTTP_STATUS_CODE.UPDATED,
            "type": "EDIT_CATEGORY"
        },
        ROLE_CREATED: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.CREATED,

                "type": "ROLE_CREATED",
                "data": data
            };
        },
        ROLE_EDITED: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.UPDATED,

                "type": "ROLE_EDITED",
                "data": data
            };
        },
        ROLE_BLOCKED: {
            "statusCode": HTTP_STATUS_CODE.UPDATED,

            "type": "ROLE_BLOCKED"
        },
        ROLE_UNBLOCKED: {
            "statusCode": HTTP_STATUS_CODE.UPDATED,

            "type": "ROLE_UNBLOCKED"
        },
        ROLE_DELETED: {
            "statusCode": HTTP_STATUS_CODE.UPDATED,

            "type": "ROLE_DELETED"
        },
        ROLE_LIST: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,

                "type": "ROLE_LIST",
                "data": data
            };
        },
        ROLE_DETAILS: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "message": "Role details get successfully",
                "type": "ROLE_DETAILS",
                "data": data
            };
        },
        SUB_ADMIN_CREATED: {
            "statusCode": HTTP_STATUS_CODE.CREATED,
            "message": "Sub admin registered successfully",
            "type": "SUB_ADMIN_CREATED",
        },
        SUB_ADMIN_EDITED: {
            "statusCode": HTTP_STATUS_CODE.UPDATED,
            "message": "Subadmin updated successfully",
            "type": "SUB_ADMIN_EDITED",
        },
        SUB_ADMIN_BLOCKED: {
            "statusCode": HTTP_STATUS_CODE.UPDATED,
            "message": "Subadmin inactivated successfully",
            "type": "SUB_ADMIN_BLOCKED"
        },
        SUB_ADMIN_UNBLOCKED: {
            "statusCode": HTTP_STATUS_CODE.UPDATED,
            "message": "Subadmin activated successfully",
            "type": "SUB_ADMIN_UNBLOCKED"
        },
        SUB_ADMIN_DELETED: {
            "statusCode": HTTP_STATUS_CODE.UPDATED,
            "message": "Subadmin deleted successfully",
            "type": "SUB_ADMIN_DELETED"
        },
        USER_DELETED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "message": "User deleted successfully",
            "type": "USER_DELETED"
        },
        USER_ADDED: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "type": "USER_ADDED",
                "data": data
            };
        },
        USER_UPDATED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "USER_UPDATED",
            "message": "User updated successfully"
        },
        POST_ADDED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "POST_ADDED"
        },
        POST_DELETED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "POST_DELETED"
        },
        POST_UPDATED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "POST_UPDATED"
        },
        POST_REPORTED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "POST_REPORTED"
        },
        STORY_ADDED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "STORY_ADDED"
        },
        STORY_DELETED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "STORY_DELETED"
        },
        STORY_UPDATED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "STORY_UPDATED"
        },
        STORY_REPORTED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "POST_REPORTED"
        },
        GROUP_ADDED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "GROUP_ADDED"
        },
        GROUP_DELETED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "GROUP_DELETED"
        },
        GROUP_BLOCKED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "GROUP_BLOCKED"
        },
        GROUP_UNBLOCKED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "GROUP_UNBLOCKED"
        },
        FAQ_ADDED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "FAQ_ADDED"
        },
        FAQ_DELETED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "FAQ_DELETED"
        },
        ENQUIRY_ADDED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "ENQUIRY_ADDED"
        },
        ENQUIRY_DELETED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "ENQUIRY_DELETED"
        },
        FAQ_UPDATED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "FAQ_UPDATED"
        },
        USER_REMOVED_FROM_GROUP: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "USER_REMOVED_FROM_GROUP"
        },
        LEFT_GROUP: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "LEFT_GROUP"
        },
        GROUP_UPDATED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "GROUP_UPDATED"
        },
        GROUP_REPORTED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "GROUP_REPORTED"
        },
        GROUP_JOINED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "GROUP_JOINED"
        },
        COMMENT_ADDED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "COMMENT_ADDED"
        },
        COMMENT_DELETED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "COMMENT_DELETED"
        },
        REQUEST_SENT: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "REQUEST_SENT"
        },
        REQUEST_DELETED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "REQUEST_DELETED"
        },
        REQUEST_REJECTED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "REQUEST_REJECTED"
        },
        REQUEST_ACCEPTED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "REQUEST_ACCEPTED"
        },
        LIKE_ADDED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "LIKE_ADDED"
        },
        LIKE_REMOVED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "LIKE_REMOVED"
        },
        SUB_ADMIN_DETAILS: (data: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "message": "Sub admin details get successfully",
                "type": "SUB_ADMIN_DETAILS",
                "data": data
            };
        },
        USER_BLOCKED_SUCCESSFULLY: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "USER_BLOCKED_SUCCESSFULLY"
        },
        USER_UNBLOCKED_SUCCESSFULLY: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "USER_UNBLOCKED_SUCCESSFULLY"
        },
        USERNAME_AVAILABILITY: (isExists: any) => {
            return {
                "statusCode": HTTP_STATUS_CODE.OK,
                "message": isExists ? "Username is already taken" : "Username is available.",
                "type": "USERNAME_AVAILABILITY",
                "data": isExists
            };
        },
        MPIN_SET: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "MPIN_SET",
            "message": "MPIN set successfully"
        },
        MPIN_VERIFIED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "MPIN_VERIFIED",
            "message": "MPIN verified successfully"
        },
        RESET_MPIN: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "RESET_MPIN",
            "message": "MPIN reset successfully"
        },
        MPIN_CHANGED: {
            "statusCode": HTTP_STATUS_CODE.OK,
            "type": "MPIN_CHANGED",
            "message": "MPIN changed successfully"
        },


    }

}