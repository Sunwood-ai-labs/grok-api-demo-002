class CatBounce {
    constructor() {
        this.container = document.getElementById('game-container');
        this.cats = [];
        this.init();
    }

    init() {
        this.addCat();
        this.animate();
    }

    addCat(x, y, vx, vy) {
        const cat = document.createElement('img');
        cat.src = 'cat.png';
        cat.className = 'cat-image';
        this.container.appendChild(cat);

        const catData = {
            element: cat,
            x: x ?? Math.random() * (window.innerWidth - 100),
            y: y ?? Math.random() * (window.innerHeight - 100),
            vx: vx ?? (Math.random() - 0.5) * 10,
            vy: vy ?? (Math.random() - 0.5) * 10,
            width: 100,
            height: 100
        };

        this.cats.push(catData);
        return catData;
    }

    splitCat(cat) {
        // 画面内に収まる位置で分裂
        const newX = Math.min(Math.max(cat.x, 0), window.innerWidth - cat.width);
        const newY = Math.min(Math.max(cat.y, 0), window.innerHeight - cat.height);

        // 新しい速度を計算（元の速度を基準に少しランダムに変化）
        const speed = Math.sqrt(cat.vx * cat.vx + cat.vy * cat.vy);
        const angle1 = Math.atan2(cat.vy, cat.vx) + (Math.random() - 0.5);
        const angle2 = Math.atan2(cat.vy, cat.vx) - (Math.random() - 0.5);

        this.addCat(newX, newY, speed * Math.cos(angle1), speed * Math.sin(angle1));
        this.addCat(newX, newY, speed * Math.cos(angle2), speed * Math.sin(angle2));
    }

    checkCollision(cat1, cat2) {
        return !(cat1.x + cat1.width < cat2.x ||
                cat2.x + cat2.width < cat1.x ||
                cat1.y + cat1.height < cat2.y ||
                cat2.y + cat2.height < cat1.y);
    }

    handleCollisions() {
        for (let i = 0; i < this.cats.length; i++) {
            for (let j = i + 1; j < this.cats.length; j++) {
                const cat1 = this.cats[i];
                const cat2 = this.cats[j];

                if (this.checkCollision(cat1, cat2)) {
                    // 速度を交換
                    [cat1.vx, cat2.vx] = [cat2.vx, cat1.vx];
                    [cat1.vy, cat2.vy] = [cat2.vy, cat1.vy];

                    // 重なりを防ぐため、少し離す
                    const dx = cat2.x - cat1.x;
                    const dy = cat2.y - cat1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDistance = cat1.width;
                    
                    if (distance < minDistance) {
                        const angle = Math.atan2(dy, dx);
                        const pushX = Math.cos(angle) * (minDistance - distance) / 2;
                        const pushY = Math.sin(angle) * (minDistance - distance) / 2;
                        
                        cat1.x -= pushX;
                        cat1.y -= pushY;
                        cat2.x += pushX;
                        cat2.y += pushY;
                    }
                }
            }
        }
    }

    animate() {
        const maxCats = 20; // パフォーマンスのため最大数を制限

        this.cats.forEach(cat => {
            // 位置を更新
            cat.x += cat.vx;
            cat.y += cat.vy;

            // 画面端での跳ね返りと分裂
            let shouldSplit = false;
            if (cat.x <= 0 || cat.x + cat.width >= window.innerWidth) {
                cat.vx = -cat.vx;
                shouldSplit = true;
            }
            if (cat.y <= 0 || cat.y + cat.height >= window.innerHeight) {
                cat.vy = -cat.vy;
                shouldSplit = true;
            }

            // 画面内に収める
            cat.x = Math.min(Math.max(cat.x, 0), window.innerWidth - cat.width);
            cat.y = Math.min(Math.max(cat.y, 0), window.innerHeight - cat.height);

            // 要素の位置を更新
            cat.element.style.transform = `translate(${cat.x}px, ${cat.y}px)`;

            // 分裂処理
            if (shouldSplit && this.cats.length < maxCats) {
                this.splitCat(cat);
            }
        });

        // 衝突判定
        this.handleCollisions();

        requestAnimationFrame(() => this.animate());
    }
}

// ゲーム開始
window.addEventListener('DOMContentLoaded', () => {
    new CatBounce();
});
