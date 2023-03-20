import { Tag  } from 'antd';


export default function StatusBadge({status_id}) {
    let badge_color = "";
    let badge_content = "";

    // 1 WAITING_PAYMENT (DEFAULT)
    // 2 PROCESSED
    // 3 ON_DELIVERY
    // 4 DELIVERED
    // 5 CANCELLED
    // CACHED ON REDIS

    switch(status_id){
        case 1:
            badge_color = "#f2ca52";
            badge_content = "Waiting Payment";
            break;
        case 2:
            badge_color = "#2db7f5";
            badge_content = "On Process";
            break;
        case 3:
            badge_color = "#87d068";
            badge_content = "On Delivery";
            break;
        case 4:
            badge_color = "#87d068";
            badge_content = "Delivered";
            break;
        case 5:
            badge_color = "red";
            badge_content = "Cancelled";
            break;
        default :
            badge_color = "blue"
            badge_content = "-"
            break;
    }
    return (
        <Tag color={badge_color}>{badge_content}</Tag>
    );
}