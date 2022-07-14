//! 将 `toca` 方法封装成 `tauri` 指令, 供 `Js` 直接调用
use toca::{KeyboardAction, KeyboardMapper, KeyboardPlayer, KeyboardRecorder, MouseAction, MousePlayer, MouseRecorder};
use tauri::command;

// region keyboard
/// 录制键盘
pub fn record_keyboard(signal: String) -> String {
    match KeyboardMapper::front_to_dq(&signal) {
        Some(key) => {
            match KeyboardRecorder::new().do_record(key).to_string() {
                Ok(s) => s,
                Err(_) => String::from("")
            }
        }
        None => String::from("")
    }
}

/// 异步录制键盘
#[command]
pub async fn record_keyboard_async(signal: String) -> String {
    record_keyboard(signal)
}

/// 播放键盘
pub fn display_keyboard(action_string: String) -> bool {
    let mut player = KeyboardPlayer::new();

    match KeyboardAction::from_string(&action_string) {
        Ok(action) => {
            match player.load(action) {
                Ok(_) => {
                    match player.do_play() {
                        Ok(_) => true,
                        Err(_) => false
                    }
                }
                Err(_) => false
            }
        }
        Err(_) => false
    }
}

/// 异步播放键盘
#[command]
pub async fn display_keyboard_async(action_string: String) -> bool {
    display_keyboard(action_string)
}
// endregion

// region mouse
/// 录制鼠标
pub fn record_mouse(signal: String) -> String {
    match KeyboardMapper::front_to_dq(&signal) {
        Some(key) => {
            match MouseRecorder::new().do_record(key).to_string() {
                Ok(s) => s,
                Err(_) => String::from("")
            }
        }
        None => String::from("")
    }
}

/// 异步录制鼠标
#[command]
pub async fn record_mouse_async(signal: String) -> String {
    record_mouse(signal)
}

/// 播放鼠标
pub fn display_mouse(action_string: String) -> bool {
    let mut player = MousePlayer::new();

    match MouseAction::from_string(&action_string) {
        Ok(action) => {
            match player.load(action) {
                Ok(_) => {
                    match player.do_play() {
                        Ok(_) => true,
                        Err(_) => false
                    }
                }
                Err(_) => false
            }
        }
        Err(_) => false
    }
}

/// 异步播放鼠标
#[command]
pub async fn display_mouse_async(action_string: String) -> bool {
    display_mouse(action_string)
}
// endregion

#[cfg(test)]
mod test {
    use super::*;

    /// **pass**
    #[test]
    fn record_keyboard_to_string() {
        let action_string = record_keyboard("Escape".to_string());
        println!("{:?}", action_string);
    }

    /// **pass**
    #[test]
    fn display_keyboard_from_string() {
        let action = String::from("{\"evs\":[{\"code\":\"KeyH\",\"press\":true,\"timestamp\":58},{\"code\":\"KeyH\",\"press\":false,\"timestamp\":138},{\"code\":\"KeyE\",\"press\":true,\"timestamp\":185},{\"code\":\"KeyE\",\"press\":false,\"timestamp\":277},{\"code\":\"KeyK\",\"press\":true,\"timestamp\":456},{\"code\":\"KeyK\",\"press\":false,\"timestamp\":507},{\"code\":\"KeyL\",\"press\":true,\"timestamp\":577},{\"code\":\"KeyL\",\"press\":false,\"timestamp\":627},{\"code\":\"Backspace\",\"press\":true,\"timestamp\":1174},{\"code\":\"Backspace\",\"press\":false,\"timestamp\":1238},{\"code\":\"Backspace\",\"press\":true,\"timestamp\":1518},{\"code\":\"Backspace\",\"press\":false,\"timestamp\":1585},{\"code\":\"KeyL\",\"press\":true,\"timestamp\":1918},{\"code\":\"KeyL\",\"press\":false,\"timestamp\":1989},{\"code\":\"KeyL\",\"press\":true,\"timestamp\":2028},{\"code\":\"KeyL\",\"press\":false,\"timestamp\":2118},{\"code\":\"KeyO\",\"press\":true,\"timestamp\":2195},{\"code\":\"KeyO\",\"press\":false,\"timestamp\":2277},{\"code\":\"Space\",\"press\":true,\"timestamp\":2676},{\"code\":\"Space\",\"press\":false,\"timestamp\":2791},{\"code\":\"KeyW\",\"press\":true,\"timestamp\":2874},{\"code\":\"KeyW\",\"press\":false,\"timestamp\":2987},{\"code\":\"KeyO\",\"press\":true,\"timestamp\":3058},{\"code\":\"KeyO\",\"press\":false,\"timestamp\":3154},{\"code\":\"KeyR\",\"press\":true,\"timestamp\":3829},{\"code\":\"KeyR\",\"press\":false,\"timestamp\":3927},{\"code\":\"KeyL\",\"press\":true,\"timestamp\":4075},{\"code\":\"KeyD\",\"press\":true,\"timestamp\":4161},{\"code\":\"KeyL\",\"press\":false,\"timestamp\":4163},{\"code\":\"KeyD\",\"press\":false,\"timestamp\":4279},{\"code\":\"ShiftRight\",\"press\":true,\"timestamp\":4627},{\"code\":\"Digit1\",\"press\":true,\"timestamp\":4758},{\"code\":\"Digit1\",\"press\":false,\"timestamp\":4844},{\"code\":\"ShiftRight\",\"press\":false,\"timestamp\":4911}],\"till\":6093}");
        println!("result is: {}", display_keyboard(action));
    }

    /// **pass**
    #[test]
    fn record_mouse_to_string() {
        let action_string = record_mouse("Escape".to_string());
        println!("{:?}", action_string);
    }

    /// **pass**
    #[test]
    fn display_mouse_from_string() {
        let action = String::from("{\"evs\":[{\"ev_name\":1,\"position\":[2313,579],\"timestamp\":1269},{\"ev_name\":2,\"position\":[2313,579],\"timestamp\":1348},{\"ev_name\":3,\"position\":[2226,469],\"timestamp\":1668},{\"ev_name\":4,\"position\":[2226,469],\"timestamp\":1740},{\"ev_name\":1,\"position\":[2278,537],\"timestamp\":2484},{\"ev_name\":2,\"position\":[2278,537],\"timestamp\":2588}],\"till\":3334}");
        println!("result is: {}", display_mouse(action));
    }
}