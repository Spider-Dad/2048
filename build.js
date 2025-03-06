const fs = require('fs');
const path = require('path');

// Создаем директорию build, если она не существует
if (!fs.existsSync('build')) {
    fs.mkdirSync('build');
}

// Функция для копирования файла
function copyFile(source, target) {
    fs.copyFileSync(source, target);
    console.log(`Copied: ${source} -> ${target}`);
}

// Функция для рекурсивного копирования директории
function copyDir(source, target) {
    // Создаем целевую директорию, если она не существует
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    // Получаем содержимое исходной директории
    const files = fs.readdirSync(source);

    // Копируем каждый файл/директорию
    for (const file of files) {
        const sourcePath = path.join(source, file);
        const targetPath = path.join(target, file);

        // Проверяем, является ли это директорией
        if (fs.statSync(sourcePath).isDirectory()) {
            // Рекурсивно копируем директорию
            copyDir(sourcePath, targetPath);
        } else {
            // Копируем файл
            copyFile(sourcePath, targetPath);
        }
    }
}

// Файлы для копирования
const filesToCopy = ['index.html', 'styles.css', 'game.js'];

// Копируем отдельные файлы
for (const file of filesToCopy) {
    copyFile(file, path.join('build', file));
}

// Копируем директорию fonts
if (fs.existsSync('fonts')) {
    copyDir('fonts', path.join('build', 'fonts'));
}

console.log('Build completed successfully!'); 