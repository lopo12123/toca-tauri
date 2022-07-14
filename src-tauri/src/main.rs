#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

mod toca_commands;

use tauri::{Builder, generate_context, generate_handler};
use toca_commands::{
    record_keyboard_async,
    record_mouse_async,
    display_keyboard_async,
    display_mouse_async,
};

fn main() {
    Builder::default()
        // ipc 命令 - javascript 端使用 invoke(cmd, args) 调用
        .invoke_handler(generate_handler![
            record_keyboard_async,
            record_mouse_async,
            display_keyboard_async,
            display_mouse_async
        ])

        // 创建一个空的菜单列表则菜单自动隐藏
        // .menu(tauri::Menu::with_items(vec![]))

        // 运行 tauri.conf.json 配置信息
        .run(generate_context!())
        .expect("error while running tauri application");
}