import { CANCELLED } from "dns";

enum OrderStatus {
    PENDING = 'Pending',
    CONFIRMED = 'Confirmed',
    REJECTED = 'Rejected',
    CANCELLED = 'Cancelled',
    DISPATCHED = 'Dispatched',
    COMPLETED = 'Completed'

}

export default OrderStatus;