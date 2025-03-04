
class PlanetBuilder {
    constructor() {
        this.orbits = Array(4).fill().map(() => []);
        this.score = 0;
        this.maxPlanetsPerOrbit = 3;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Setup draggable elements
        document.querySelectorAll('.element').forEach(element => {
            element.addEventListener('dragstart', (e) => this.handleDragStart(e));
        });

        // Setup drop zones (orbits)
        document.querySelectorAll('.orbit').forEach(orbit => {
            orbit.addEventListener('dragover', (e) => this.handleDragOver(e));
            orbit.addEventListener('drop', (e) => this.handleDrop(e));
        });

        // Reset button
        document.getElementById('reset').addEventListener('click', () => this.resetSystem());
    }

    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.type);
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDrop(e) {
        e.preventDefault();
        const type = e.dataTransfer.getData('text/plain');
        const orbitIndex = parseInt(e.target.dataset.orbit);

        if (this.canAddPlanet(orbitIndex)) {
            this.addPlanet(type, orbitIndex, e.target);
            this.checkStability();
            this.updateScore();
        }
    }

    canAddPlanet(orbitIndex) {
        return this.orbits[orbitIndex].length < this.maxPlanetsPerOrbit;
    }

    addPlanet(type, orbitIndex, orbit) {
        const planet = document.createElement('div');
        planet.className = 'planet';
        planet.dataset.type = type;
        
        switch(type) {
            case 'earth': planet.textContent = '🌍'; break;
            case 'fire': planet.textContent = '🔥'; break;
            case 'water': planet.textContent = '💧'; break;
        }

        // Calculate position on orbit
        const angle = (this.orbits[orbitIndex].length * (360 / this.maxPlanetsPerOrbit)) * (Math.PI / 180);
        const radius = parseInt(getComputedStyle(orbit).width) / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        planet.style.transform = `translate(${x}px, ${y}px)`;
        orbit.appendChild(planet);
        this.orbits[orbitIndex].push(type);
    }

    checkStability() {
        for (let i = 0; i < this.orbits.length - 1; i++) {
            const currentOrbit = this.orbits[i];
            const nextOrbit = this.orbits[i + 1];

            if (this.hasConflict(currentOrbit, nextOrbit)) {
                this.createExplosion(i);
                this.clearOrbits(i, i + 1);
            }
        }
    }

    hasConflict(orbit1, orbit2) {
        return orbit1.some(element => element === 'fire') && 
               orbit2.some(element => element === 'water') ||
               orbit1.some(element => element === 'water') && 
               orbit2.some(element => element === 'fire');
    }

    createExplosion(orbitIndex) {
        const orbit = document.querySelector(`[data-orbit="${orbitIndex}"]`);
        const explosion = document.createElement('div');
        explosion.className = 'explosion';
        explosion.textContent = '💥';
        orbit.appendChild(explosion);
        
        setTimeout(() => explosion.remove(), 1000);
    }

    clearOrbits(...orbitIndices) {
        orbitIndices.forEach(index => {
            const orbit = document.querySelector(`[data-orbit="${index}"]`);
            Array.from(orbit.getElementsByClassName('planet')).forEach(planet => planet.remove());
            this.orbits[index] = [];
        });
    }

    updateScore() {
        let newScore = 0;
        this.orbits.forEach((orbit, index) => {
            newScore += orbit.length * (index + 1);
        });
        this.score = newScore;
        document.getElementById('score').textContent = this.score;
    }

    resetSystem() {
        this.orbits.forEach((_, index) => this.clearOrbits(index));
        this.score = 0;
        this.updateScore();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PlanetBuilder();
});
