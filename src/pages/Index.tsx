import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [driversLicense, setDriversLicense] = useState('');
  const [vehicleRegistration, setVehicleRegistration] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [fines, setFines] = useState<any[]>([]);

  const handleCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      setFines([
        {
          id: '18810114231000001',
          date: '15.10.2024',
          article: 'ч.1 ст.12.9 КоАП',
          description: 'Превышение скорости на 20 км/ч',
          amount: 500,
          discount: true,
          location: 'М-11, 45 км'
        },
        {
          id: '18810114231000002',
          date: '02.10.2024',
          article: 'ч.1 ст.12.12 КоАП',
          description: 'Проезд на запрещающий сигнал светофора',
          amount: 1000,
          discount: true,
          location: 'г. Москва, ул. Тверская'
        }
      ]);
      setIsChecking(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Car" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Штрафы ГИБДД</h1>
                <p className="text-xs text-muted-foreground">Проверка и оплата онлайн</p>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Icon name="Phone" size={16} />
              <span className="hidden sm:inline">Поддержка</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <section className="mb-12 animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Проверка штрафов ГИБДД
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Введите данные для быстрой проверки неоплаченных штрафов
            </p>
          </div>

          <Card className="max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Search" size={24} />
                Форма проверки
              </CardTitle>
              <CardDescription>
                Проверка займет не более 10 секунд
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Номер водительского удостоверения</label>
                <Input
                  placeholder="99 99 999999"
                  value={driversLicense}
                  onChange={(e) => setDriversLicense(e.target.value)}
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Номер свидетельства о регистрации ТС (СТС)</label>
                <Input
                  placeholder="99 99 999999"
                  value={vehicleRegistration}
                  onChange={(e) => setVehicleRegistration(e.target.value)}
                  className="text-base"
                />
              </div>
              <Button 
                onClick={handleCheck} 
                className="w-full h-12 text-base font-medium"
                disabled={isChecking || !driversLicense || !vehicleRegistration}
              >
                {isChecking ? (
                  <>
                    <Icon name="Loader2" className="animate-spin mr-2" size={20} />
                    Проверяем...
                  </>
                ) : (
                  <>
                    <Icon name="Search" className="mr-2" size={20} />
                    Проверить штрафы
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {fines.length > 0 && (
            <div className="max-w-2xl mx-auto mt-8 space-y-4 animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Найдено штрафов: {fines.length}</h3>
                <Badge variant="destructive" className="text-base px-3 py-1">
                  Сумма: {fines.reduce((acc, fine) => acc + (fine.discount ? fine.amount / 2 : fine.amount), 0)} ₽
                </Badge>
              </div>

              {fines.map((fine, index) => (
                <Card key={fine.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Icon name="AlertCircle" className="text-destructive" size={20} />
                          {fine.description}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {fine.article} • {fine.location}
                        </CardDescription>
                      </div>
                      {fine.discount && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          -50%
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Дата нарушения</p>
                        <p className="font-medium">{fine.date}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">УИН</p>
                        <p className="font-mono text-sm">{fine.id}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-sm text-muted-foreground">Сумма</p>
                        <div className="flex items-center gap-2">
                          {fine.discount && (
                            <span className="line-through text-muted-foreground">{fine.amount} ₽</span>
                          )}
                          <span className="text-xl font-bold text-primary">
                            {fine.discount ? fine.amount / 2 : fine.amount} ₽
                          </span>
                        </div>
                      </div>
                      <Button className="gap-2 h-10">
                        <Icon name="CreditCard" size={18} />
                        Оплатить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">Преимущества сервиса</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Icon name="Zap" className="text-primary" size={24} />
                </div>
                <CardTitle>Быстрая проверка</CardTitle>
                <CardDescription>
                  Проверка штрафов за 10 секунд. Данные напрямую из ГИС ГМП
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Icon name="Shield" className="text-primary" size={24} />
                </div>
                <CardTitle>Безопасность</CardTitle>
                <CardDescription>
                  Защищенное соединение и конфиденциальность данных
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Icon name="Percent" className="text-primary" size={24} />
                </div>
                <CardTitle>Скидка 50%</CardTitle>
                <CardDescription>
                  Оплата со скидкой при оплате в течение 20 дней
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">Часто задаваемые вопросы</h3>
          <Card className="max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    Как проверить штрафы ГИБДД онлайн?
                  </AccordionTrigger>
                  <AccordionContent>
                    Для проверки штрафов введите номер водительского удостоверения и номер СТС (свидетельства о регистрации транспортного средства) в форму выше. Проверка занимает не более 10 секунд.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    Как получить скидку 50% на штраф?
                  </AccordionTrigger>
                  <AccordionContent>
                    Скидка 50% предоставляется при оплате штрафа в течение 20 дней со дня вынесения постановления. Скидка не распространяется на повторные нарушения и нарушения, связанные с алкогольным опьянением.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    Безопасно ли оплачивать штрафы онлайн?
                  </AccordionTrigger>
                  <AccordionContent>
                    Да, наш сервис использует защищенное соединение и современные методы шифрования данных. Оплата проходит через проверенные платежные системы. Ваши данные надежно защищены.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
                    Что делать, если штраф уже оплачен, но все еще отображается?
                  </AccordionTrigger>
                  <AccordionContent>
                    Информация об оплате поступает в базу ГИС ГМП в течение 1-3 рабочих дней. Если после этого срока штраф продолжает отображаться, сохраните квитанцию об оплате и обратитесь в подразделение ГИБДД, выписавшее штраф.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">
                    Можно ли обжаловать штраф?
                  </AccordionTrigger>
                  <AccordionContent>
                    Да, постановление о штрафе можно обжаловать в течение 10 дней со дня его получения. Жалобу можно подать в подразделение ГИБДД, вынесшее постановление, или в районный суд по месту совершения нарушения.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <Card className="bg-primary text-primary-foreground max-w-4xl mx-auto">
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <Icon name="Bell" size={48} className="mx-auto" />
                <h3 className="text-2xl font-bold">Подключите уведомления</h3>
                <p className="text-primary-foreground/90 max-w-2xl mx-auto">
                  Получайте мгновенные уведомления о новых штрафах и не пропускайте период скидки 50%
                </p>
                <Button variant="secondary" size="lg" className="gap-2 mt-4">
                  <Icon name="Smartphone" size={20} />
                  Подключить уведомления
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Icon name="Car" size={20} />
                Штрафы ГИБДД
              </h4>
              <p className="text-sm text-muted-foreground">
                Быстрая проверка и оплата штрафов ГИБДД онлайн
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Информация</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">О сервисе</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Способы оплаты</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Часто задаваемые вопросы</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Контакты</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  8-800-000-00-00
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  support@gibdd-fines.ru
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Clock" size={16} />
                  Ежедневно 24/7
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 Штрафы ГИБДД. Информация актуальна на {new Date().toLocaleDateString('ru-RU')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
