const fs = require('fs');
const path = require('path');

console.log('Starting build process...');

try {
    // Создаем директорию build, если она не существует
    if (!fs.existsSync('build')) {
        fs.mkdirSync('build');
        console.log('Created build directory');
    } else {
        console.log('Build directory already exists');
    }

    // Функция для копирования файла
    function copyFile(source, target) {
        try {
            fs.copyFileSync(source, target);
            console.log(`Copied: ${source} -> ${target}`);
        } catch (error) {
            console.error(`Error copying file ${source}: ${error.message}`);
            throw error;
        }
    }

    // Функция для рекурсивного копирования директории
    function copyDir(source, target) {
        try {
            // Создаем целевую директорию, если она не существует
            if (!fs.existsSync(target)) {
                fs.mkdirSync(target, { recursive: true });
                console.log(`Created directory: ${target}`);
            }

            // Получаем содержимое исходной директории
            const files = fs.readdirSync(source);
            console.log(`Found ${files.length} files/directories in ${source}`);

            // Копируем каждый файл/директорию
            for (const file of files) {
                const sourcePath = path.join(source, file);
                const targetPath = path.join(target, file);

                // Проверяем, является ли это директорией
                if (fs.statSync(sourcePath).isDirectory()) {
                    // Рекурсивно копируем директорию
                    console.log(`Copying directory: ${sourcePath}`);
                    copyDir(sourcePath, targetPath);
                } else {
                    // Копируем файл
                    copyFile(sourcePath, targetPath);
                }
            }
        } catch (error) {
            console.error(`Error copying directory ${source}: ${error.message}`);
            throw error;
        }
    }

    // Файлы для копирования
    const filesToCopy = ['index.html', 'styles.css', 'game.js', 'package.json', '.npmrc', '.nvmrc', 'Procfile'];
    console.log(`Files to copy: ${filesToCopy.join(', ')}`);

    // Копируем отдельные файлы
    for (const file of filesToCopy) {
        if (fs.existsSync(file)) {
            copyFile(file, path.join('build', file));
        } else {
            console.warn(`Warning: File ${file} does not exist and will not be copied`);
        }
    }

    // Копируем директорию fonts
    if (fs.existsSync('fonts')) {
        console.log('Copying fonts directory...');
        copyDir('fonts', path.join('build', 'fonts'));
    } else {
        console.warn('Warning: fonts directory does not exist');
    }

    console.log('Build completed successfully!');
} catch (error) {
    console.error(`Build failed: ${error.message}`);
    process.exit(1);
} 