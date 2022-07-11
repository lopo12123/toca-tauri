#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

mod toca_commands;

use tauri::{Builder, generate_context, generate_handler};
use toca_commands::{record_keyboard, record_mouse, display_keyboard, display_mouse};

fn main() {
    Builder::default()
        // ipc 命令
        .invoke_handler(generate_handler![
            record_keyboard,
        ])

        // 创建一个空的菜单列表则菜单自动隐藏
        .menu(tauri::Menu::with_items(vec![]))

        // 运行 tauri.conf.json 配置信息
        .run(generate_context!())
        .expect("error while running tauri application");
}