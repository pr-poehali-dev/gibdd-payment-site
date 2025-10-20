import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import Icon from '@/components/ui/icon';

const Index = () => {
  const [driversLicense, setDriversLicense] = useState('');
  const [vehicleRegistration, setVehicleRegistration] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('500');

  const handlePayment = async () => {
    if (!driversLicense || !vehicleRegistration) return;

    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/cc8fc610-0f41-4cd5-abbb-fbba31d2f722', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          drivers_license: driversLicense,
          vehicle_registration: vehicleRegistration,
        }),
      });

      const data = await response.json();

      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        alert('Ошибка создания платежа');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Ошибка соединения с сервером');
      setIsLoading(false);
    }
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
              Оплата штрафов ГИБДД
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Введите данные для оплаты штрафов ГИБДД
            </p>
          </div>

          <Card className="max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="CreditCard" size={24} />
                Форма оплаты
              </CardTitle>
              <CardDescription>
                Быстрая и безопасная оплата штрафов ГИБДД
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Сумма к оплате (₽)</label>
                <Input
                  type="number"
                  placeholder="500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-base"
                />
              </div>
              <Button 
                onClick={handlePayment} 
                className="w-full h-12 text-base font-medium"
                disabled={!driversLicense || !vehicleRegistration || isLoading}
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" className="animate-spin mr-2" size={20} />
                    Создание платежа...
                  </>
                ) : (
                  <>
                    <Icon name="CreditCard" className="mr-2" size={20} />
                    Перейти к оплате
                  </>
                )}
              </Button>
            </CardContent>
          </Card>


        </section>

        <section className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">Преимущества сервиса</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Icon name="Zap" className="text-primary" size={24} />
                </div>
                <CardTitle>Быстрая оплата</CardTitle>
                <CardDescription>
                  Оплата штрафов в несколько кликов. Без комиссии
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
                  <Icon name="Clock" className="text-primary" size={24} />
                </div>
                <CardTitle>Круглосуточно</CardTitle>
                <CardDescription>
                  Оплата доступна 24 часа в сутки, 7 дней в неделю
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>


      </main>

      <footer className="border-t bg-muted/30 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Штрафы ГИБДД</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;