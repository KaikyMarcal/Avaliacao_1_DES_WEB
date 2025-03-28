const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    const activeSection = ref('story');
    const currentTimelineDetail = ref(null);
    const characterFilter = ref('');
    const characterTypeFilter = ref('all');
    const selectedCharacter = ref(null);
    const chartType = ref('all');
    const demonChart = ref(null);
    let chartInstance = null;
    
    const timeline = ref([
      {
        year: '1457',
        title: 'Nascimento de Hyakkimaru',
        description: 'Hyakkimaru nasce sem membros, órgãos sensoriais ou pele como resultado do pacto de seu pai com demônios.',
        image: 'images/timeline/hyakkimaru-birth.jpg'
      },
      {
        year: '1460',
        title: 'Abandono de Hyakkimaru',
        description: 'Seu pai, Daigo Kagemitsu, abandona Hyakkimaru em um rio em um cesto, onde é encontrado pelo médico Jukai.',
        image: 'images/timeline/abandonment.jpg'
      },
      {
        year: '1475',
        title: 'Encontro com Dororo',
        description: 'Hyakkimaru encontra Dororo, um jovem ladrão, e os dois começam sua jornada juntos.',
        image: 'images/timeline/meeting-dororo.jpg'
      },
      {
        year: '1476',
        title: 'Primeiro Demônio Derrotado',
        description: 'Hyakkimaru derrota seu primeiro demônio e recupera parte de sua pele.',
        image: 'images/timeline/first-demon.jpg'
      }
    ]);
    const characters = ref([
      {
        id: 1,
        name: 'Hyakkimaru',
        role: 'Protagonista',
        type: 'human',
        image: 'images/characters/hyakkimaru.jpg',
        description: 'Um jovem que nasceu sem membros, órgãos sensoriais ou pele devido ao pacto de seu pai com demônios. Em sua jornada, ele luta para recuperar seu corpo derrotando os demônios que receberam suas partes corporais.',
        abilities: [
          'Proteses com armas ocultas',
          'Percepção espiritual aprimorada',
          'Habilidades de combate excepcionais',
          'Resistência sobre-humana'
        ]
      },
      {
        id: 2,
        name: 'Dororo',
        role: 'Co-protagonista',
        type: 'human',
        image: 'images/characters/dororo.jpg',
        description: 'Um jovem ladrão órfão que se torna companheiro de Hyakkimaru em sua jornada. Apesar de sua personalidade brincalhona, ele tem um coração puro e se torna um amigo leal de Hyakkimaru.',
        abilities: [
          'Habilidades de ladrão e sobrevivência',
          'Agilidade e destreza',
          'Carisma e persuasão',
          'Conhecimento das ruas'
        ]
      },
      {
        id: 3,
        name: 'Daigo Kagemitsu',
        role: 'Antagonista',
        type: 'human',
        image: 'images/characters/daigo.jpg',
        description: 'Pai de Hyakkimaru que fez um pacto com 48 demônios, oferecendo o corpo de seu filho não nascido em troca de prosperidade para suas terras.',
        abilities: [
          'Líder militar habilidoso',
          'Estratégia política',
          'Manipulação'
        ]
      },
      {
        id: 4,
        name: 'Demônio do Lago',
        role: 'Inimigo',
        type: 'demon',
        image: 'images/characters/lake-demon.jpg',
        description: 'O primeiro demônio que Hyakkimaru enfrenta em sua jornada. Possuía a pele de Hyakkimaru.',
        abilities: [
          'Manipulação da água',
          'Tentáculos poderosos',
          'Capacidade de se esconder em corpos d\'água'
        ]
      }
    ]);
    const demons = ref([
      { name: 'Demônio do Lago', bodyPart: 'Pele', power: 7, episode: 3 },
      { name: 'Demônio da Montanha', bodyPart: 'Ouvidos', power: 8, episode: 5 },
      { name: 'Demônio da Floresta', bodyPart: 'Olhos', power: 9, episode: 7 },
      { name: 'Demônio do Pântano', bodyPart: 'Nariz', power: 6, episode: 9 },
      { name: 'Demônio da Caverna', bodyPart: 'Braço Direito', power: 8, episode: 12 },
      { name: 'Demônio do Vale', bodyPart: 'Braço Esquerdo', power: 7, episode: 14 },
      { name: 'Demônio do Abismo', bodyPart: 'Perna Direita', power: 9, episode: 16 },
      { name: 'Demônio do Céu', bodyPart: 'Perna Esquerda', power: 8, episode: 18 }
    ]);
    const filteredCharacters = computed(() => {
      return characters.value.filter(char => {
        const nameMatch = char.name.toLowerCase().includes(characterFilter.value.toLowerCase());
        const typeMatch = characterTypeFilter.value === 'all' || char.type === characterTypeFilter.value;
        return nameMatch && typeMatch;
      });
    });
    
    const totalDemonsDefeated = computed(() => demons.value.length);
    
    const recoveredOrgans = computed(() => {
      const organs = new Set();
      demons.value.forEach(demon => organs.add(demon.bodyPart));
      return Array.from(organs);
    });
    const showTimelineDetail = (index) => {
      currentTimelineDetail.value = index;
    };
    
    const showCharacterModal = (character) => {
      selectedCharacter.value = character;
    };
    
    const initChart = () => {
      const ctx = demonChart.value.getContext('2d');
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: getChartData(),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: '#FFD700'
              },
              grid: {
                color: 'rgba(255, 215, 0, 0.1)'
              }
            },
            x: {
              ticks: {
                color: '#FFD700'
              },
              grid: {
                color: 'rgba(255, 215, 0, 0.1)'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: '#FFD700'
              }
            }
          }
        }
      });
    };
    
    const getChartData = () => {
      if (chartType.value === 'body') {
        const bodyParts = ['Pele', 'Ouvidos', 'Olhos', 'Nariz', 'Braço Direito', 'Braço Esquerdo', 'Perna Direita', 'Perna Esquerda'];
        const counts = bodyParts.map(part => 
          demons.value.filter(d => d.bodyPart === part).length
        );
        
        return {
          labels: bodyParts,
          datasets: [{
            label: 'Partes do Corpo Recuperadas',
            data: counts,
            backgroundColor: 'rgba(139, 0, 0, 0.7)'
          }]
        };
      } else if (chartType.value === 'power') {
        return {
          labels: demons.value.map(d => d.name),
          datasets: [{
            label: 'Nível de Poder (1-10)',
            data: demons.value.map(d => d.power),
            backgroundColor: demons.value.map(d => 
              `rgba(255, 215, 0, ${0.3 + (d.power / 10) * 0.7})`
            )
          }]
        };
      } else {
        return {
          labels: demons.value.map(d => d.name),
          datasets: [{
            label: 'Demônios Derrotados',
            data: demons.value.map(() => 1),
            backgroundColor: demons.value.map((_, i) => 
              `hsl(${i * 45}, 100%, 50%)`
            )
          }]
        };
      }
    };
    
    const updateChartData = (type) => {
      chartType.value = type;
      if (chartInstance) {
        chartInstance.data = getChartData();
        chartInstance.update();
      }
    };
    onMounted(() => {
      initChart();
    });
    
    return {
      activeSection,
      currentTimelineDetail,
      characterFilter,
      characterTypeFilter,
      selectedCharacter,
      timeline,
      characters,
      demons,
      filteredCharacters,
      totalDemonsDefeated,
      recoveredOrgans,
      demonChart,
      showTimelineDetail,
      showCharacterModal,
      updateChartData
    };
  }
}).mount('#app');