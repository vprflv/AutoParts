export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-200 py-12 px-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-10 text-center">
                    Политика конфиденциальности
                </h1>

                <div className="prose prose-invert max-w-none">
                    <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                        Последнее обновление: 08 мая 2026
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-12 mb-4">1. Общие положения</h2>
                    <p className="text-zinc-300">
                        Настоящая Политика конфиденциальности регулирует порядок обработки и хранения персональных данных пользователей сайта AutoPart.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-12 mb-4">2. Какие данные мы собираем</h2>
                    <ul className="list-disc list-inside text-zinc-300 space-y-2">
                        <li>Данные Telegram-аккаунта (ID, имя, username, фото)</li>
                        <li>Email и пароль (при регистрации)</li>
                        <li>Данные профиля (имя, телефон, аватарка)</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-white mt-12 mb-4">3. Цели обработки данных</h2>
                    <p className="text-zinc-300">
                        Мы используем ваши данные исключительно для предоставления сервиса, авторизации, улучшения работы приложения и связи с вами.
                    </p>

                    <h2 className="text-2xl font-semibold text-white mt-12 mb-4">4. Ваши права</h2>
                    <ul className="list-disc list-inside text-zinc-300 space-y-2">
                        <li>Право на доступ к своим данным</li>
                        <li>Право на исправление данных</li>
                        <li>Право на удаление аккаунта и данных</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-white mt-12 mb-4">5. Контакты</h2>
                    <p className="text-zinc-300">
                        По всем вопросам, связанным с обработкой персональных данных, пишите на:{" "}
                        <span className="text-blue-400">support@autopart.ru</span>
                    </p>

                    <div className="mt-16 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-500">
                        © 2026 AutoPart. Все права защищены.
                    </div>
                </div>
            </div>
        </div>
    );
}