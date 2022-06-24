use std::thread::sleep;
use std::time::Duration;
use enigo::{Enigo, Key, KeyboardControllable, MouseButton, MouseControllable};

// region misc
/// a function like `setTimeout` in JavaScript.
fn set_timeout(mut callback: impl FnMut() -> (), timeout: u64) {
    sleep(Duration::from_millis(timeout));
    callback();
}
// endregion

/// type of action to play in pipeline
#[allow(unused)]
pub enum Action {
    /// delay 毫秒后, 移动到 (x, y)
    MouseMoveAbsolute { delay: u64, xy: [i32; 2] },
    /// delay 毫秒后, 移动 (dx, dy)
    MouseMoveRelative { delay: u64, xy: [i32; 2] },
    /// delay 毫秒后, 在 (x, y) 处左键单(双)击
    MouseLeft { delay: u64, xy: [i32; 2], db: bool },
    /// delay 毫秒后, 在 (x, y) 处右键键单(双)击
    MouseRight { delay: u64, xy: [i32; 2], db: bool },
    /// delay 毫秒后, 点击 key
    KeyClick { delay: u64, key: Key },
    /// delay 毫秒后, 按下 key 并在 duration 毫秒后释放
    KeyPress { delay: u64, key: Key, duration: u64 },
}

pub struct Toca {
    instance: Enigo,
    total_time: u64,
    actions: Vec<Action>,
}

#[allow(unused)]
impl Toca {
    // constructor.
    pub fn new() -> Toca {
        Toca {
            instance: Enigo::new(),
            total_time: 0,
            actions: vec![],
        }
    }

    // how many time it takes for whole actions to play.
    pub fn get_time_count(&self) -> u64 {
        self.total_time
    }

    // how many actions in the queue
    pub fn get_action_count(&self) -> usize {
        self.actions.len()
    }

    // add an action into the queue
    pub fn add_action(&mut self, action: Action) {
        self.actions.push(action);
    }
    // add some actions into the queue
    pub fn add_actions(&mut self, actions: &mut Vec<Action>) {
        self.actions.append(actions);
    }

    // play all actions in action queue.
    pub fn play_actions(&mut self) {
        let mut p = 0;
        while p < self.actions.len() {
            match self.actions[p] {
                Action::MouseMoveAbsolute { delay, xy } => {
                    set_timeout(|| {
                        self.instance.mouse_move_to(xy[0], xy[1]);
                    }, delay);
                }
                Action::MouseMoveRelative { delay, xy } => {
                    set_timeout(|| {
                        self.instance.mouse_move_relative(xy[0], xy[1]);
                    }, delay);
                }
                Action::MouseLeft { delay, xy, db } => {
                    set_timeout(|| {
                        self.instance.mouse_move_to(x[0], y[0]);
                        self.instance.mouse_click(MouseButton::Left);
                        if db { self.instance.mouse_click(MouseButton::Left); }
                    }, delay);
                }
                Action::MouseRight { delay, xy, db } => {
                    set_timeout(|| {
                        self.instance.mouse_move_to(x[0], y[0]);
                        self.instance.mouse_click(MouseButton::Right);
                        if db { self.instance.mouse_click(MouseButton::Right); }
                    }, delay);
                }
                Action::KeyClick { delay, key } => {
                    set_timeout(|| {
                        self.instance.key_click(key);
                    }, delay);
                }
                Action::KeyPress { delay, key, duration } => {
                    set_timeout(|| {
                        self.instance.key_down(key);

                        set_timeout(|| {
                            self.instance.key_up(key);
                        }, duration);
                    }, delay);
                }
            };

            p += 1;
        }
    }
}